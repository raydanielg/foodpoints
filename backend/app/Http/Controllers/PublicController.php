<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\RestaurantTable;
use App\Models\TableSession;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicController extends Controller
{
    public function restaurantPage($slug)
    {
        $restaurant = Restaurant::where('restaurant_link', $slug)
            ->where('subscription_status', 'active')
            ->first();

        if (!$restaurant) {
            abort(404, 'Restaurant not found');
        }

        $categories = MenuCategory::where('restaurant_id', $restaurant->id)
            ->with(['items' => function ($q) {
                $q->where('is_available', true)->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->get();

        return view('public.restaurant', compact('restaurant', 'categories'));
    }

    public function scanQr($qrToken)
    {
        $table = RestaurantTable::where('qr_token', $qrToken)->first();
        if (!$table) {
            return view('public.invalid-qr');
        }

        $restaurant = Restaurant::find($table->restaurant_id);
        if (!$restaurant || $restaurant->subscription_status !== 'active') {
            return view('public.invalid-qr', ['reason' => 'inactive']);
        }

        $session = TableSession::where('table_id', $table->id)
            ->where('status', 'open')
            ->first();

        if (!$session) {
            $session = TableSession::create([
                'restaurant_id' => $table->restaurant_id,
                'table_id' => $table->id,
                'status' => 'open',
            ]);
            $table->update(['status' => 'occupied']);
        }

        $categories = MenuCategory::where('restaurant_id', $table->restaurant_id)
            ->with(['items' => function ($q) {
                $q->where('is_available', true)->orderBy('name');
            }])
            ->orderBy('sort_order')
            ->get();

        $session->load(['orders.items.menuItem', 'payments']);

        return view('public.order', compact('restaurant', 'table', 'session', 'categories'));
    }

    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|exists:table_sessions,id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'sometimes|nullable|string',
        ]);

        $session = TableSession::findOrFail($validated['session_id']);
        if ($session->status !== 'open') {
            return response()->json(['message' => 'Session is closed'], 400);
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'session_id' => $session->id,
                'restaurant_id' => $session->restaurant_id,
                'placed_by' => 'customer',
                'status' => 'received',
            ]);

            $total = 0;
            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::find($item['menu_item_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $menuItem->price,
                    'notes' => $item['notes'] ?? null,
                    'served' => false,
                    'paid' => false,
                ]);
                $total += $menuItem->price * $item['quantity'];
            }

            $session->increment('total_amount', $total);
            DB::commit();

            return response()->json([
                'order' => $order->load('items.menuItem'),
                'session' => $session->fresh()->load(['orders.items.menuItem', 'payments']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create order'], 500);
        }
    }

    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|exists:table_sessions,id',
            'amount' => 'required|numeric|min:0',
            'method' => 'required|in:mobile_money,card,cash',
            'split_type' => 'required|in:full,by_item,equal,by_amount',
            'payer_label' => 'sometimes|nullable|string|max:100',
            'payer_phone' => 'sometimes|nullable|string|max:20',
            'item_ids' => 'sometimes|array',
            'item_ids.*' => 'integer|exists:order_items,id',
        ]);

        $session = TableSession::findOrFail($validated['session_id']);
        if ($session->status !== 'open') {
            return response()->json(['message' => 'Session is closed'], 400);
        }

        $remaining = $session->total_amount - $session->paid_amount;
        if ($validated['amount'] > $remaining + 0.01) {
            return response()->json(['message' => 'Amount exceeds remaining balance'], 400);
        }

        $method = $validated['method'];

        // Cash: stays pending, waiter confirms
        if ($method === 'cash') {
            DB::beginTransaction();
            try {
                $payment = Payment::create([
                    'session_id' => $session->id,
                    'restaurant_id' => $session->restaurant_id,
                    'amount' => $validated['amount'],
                    'method' => 'cash',
                    'split_type' => $validated['split_type'],
                    'payer_label' => $validated['payer_label'] ?? null,
                    'status' => 'pending',
                    'item_ids' => $validated['item_ids'] ?? null,
                ]);
                DB::commit();
                return response()->json([
                    'payment' => $payment->fresh(),
                    'session' => $session->fresh()->load(['orders.items.menuItem', 'payments']),
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['message' => 'Payment failed'], 500);
            }
        }

        // Mobile money: use Snippe payment gateway
        if ($method === 'mobile_money') {
            $snippe = app(\App\Services\SnippeService::class);

            if (!$snippe->isConfigured()) {
                return response()->json(['message' => 'Mobile money payments are not configured. Please use cash.'], 400);
            }

            $phone = $validated['payer_phone'] ?? '';
            if (empty($phone)) {
                return response()->json(['message' => 'Phone number is required for mobile money payment'], 400);
            }

            // Normalize phone: ensure 255XXXXXXXXX format
            $phone = preg_replace('/\s+/', '', $phone);
            if (str_starts_with($phone, '0')) {
                $phone = '255' . substr($phone, 1);
            } elseif (str_starts_with($phone, '+255')) {
                $phone = substr($phone, 1);
            }

            DB::beginTransaction();
            try {
                $payment = Payment::create([
                    'session_id' => $session->id,
                    'restaurant_id' => $session->restaurant_id,
                    'amount' => $validated['amount'],
                    'method' => 'mobile_money',
                    'split_type' => $validated['split_type'],
                    'payer_label' => $validated['payer_label'] ?? null,
                    'payer_phone' => $phone,
                    'status' => 'pending',
                    'item_ids' => $validated['item_ids'] ?? null,
                ]);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['message' => 'Failed to create payment record'], 500);
            }

            // Create Snippe payment intent
            $snippeResult = $snippe->createMobilePayment([
                'amount' => (int) round($validated['amount']),
                'phone_number' => $phone,
                'customer_first_name' => $validated['payer_label'] ?? 'Customer',
                'customer_last_name' => 'Guest',
                'customer_email' => 'guest@foodpoint.co.tz',
                'metadata' => [
                    'payment_id' => $payment->id,
                    'session_id' => $session->id,
                    'restaurant_id' => $session->restaurant_id,
                ],
            ]);

            if (!$snippeResult['success']) {
                $payment->update(['status' => 'failed']);
                return response()->json([
                    'message' => $snippeResult['message'] ?? 'Failed to initiate mobile money payment',
                    'payment_status' => 'failed',
                ], 400);
            }

            $reference = $snippeResult['data']['reference'] ?? null;
            if ($reference) {
                $payment->update(['snippe_reference' => $reference]);
            }

            return response()->json([
                'payment' => $payment->fresh(),
                'snippe_reference' => $reference,
                'snippe_status' => $snippeResult['data']['status'] ?? 'pending',
                'message' => 'USSD push sent to ' . substr($phone, 0, 6) . '***' . substr($phone, -3) . '. Please authorize the payment on your phone.',
                'session' => $session->fresh()->load(['orders.items.menuItem', 'payments']),
            ], 201);
        }

        // Card: not yet supported via Snippe (Snippe is mobile money only)
        return response()->json(['message' => 'Card payments are not yet available. Please use mobile money or cash.'], 400);
    }

    public function checkPaymentStatus(Request $request, $paymentId)
    {
        $payment = Payment::findOrFail($paymentId);

        if ($payment->snippe_reference) {
            $snippe = app(\App\Services\SnippeService::class);
            $result = $snippe->getPaymentStatus($payment->snippe_reference);

            if ($result['success'] && isset($result['data']['status'])) {
                $snippeStatus = $result['data']['status'];

                if ($snippeStatus === 'completed' && $payment->status === 'pending') {
                    // Webhook might not have arrived yet, update manually
                    DB::beginTransaction();
                    try {
                        $payment->update(['status' => 'completed']);
                        $session = $payment->session;
                        $session->increment('paid_amount', $payment->amount);

                        if ($payment->split_type === 'by_item' && $payment->item_ids) {
                            OrderItem::whereIn('id', $payment->item_ids)
                                ->update([
                                    'paid' => true,
                                    'paid_by_label' => $payment->payer_label,
                                ]);
                        }

                        // Commission: 1.5% to platform
                        $commission = round($payment->amount * 0.015, 2);
                        $netEarning = $payment->amount - $commission;
                        $restaurant = \App\Models\Restaurant::find($payment->restaurant_id);
                        if ($restaurant) {
                            $restaurant->increment('available_balance', $netEarning);
                            $restaurant->increment('total_earned', $netEarning);
                            $restaurant->increment('total_commission', $commission);
                        }

                        if ($session->fresh()->paid_amount >= $session->total_amount - 0.01) {
                            $session->update([
                                'status' => 'closed',
                                'closed_at' => now(),
                            ]);
                            $session->table->update(['status' => 'free']);
                        }

                        DB::commit();
                    } catch (\Exception $e) {
                        DB::rollBack();
                    }
                } elseif ($snippeStatus === 'failed' && $payment->status === 'pending') {
                    $payment->update(['status' => 'failed']);
                }

                return response()->json([
                    'payment_status' => $payment->fresh()->status,
                    'snippe_status' => $snippeStatus,
                    'session' => $payment->session->fresh()->load(['orders.items.menuItem', 'payments']),
                ]);
            }
        }

        return response()->json([
            'payment_status' => $payment->status,
            'session' => $payment->session->load(['orders.items.menuItem', 'payments']),
        ]);
    }

    public function retryUssdPush($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);

        if (!$payment->snippe_reference || $payment->status !== 'pending') {
            return response()->json(['message' => 'Cannot retry this payment'], 400);
        }

        $snippe = app(\App\Services\SnippeService::class);
        $result = $snippe->pushUssd($payment->snippe_reference);

        if ($result['success']) {
            return response()->json(['message' => 'USSD push sent again. Check your phone.']);
        }

        return response()->json(['message' => $result['message'] ?? 'Failed to send USSD push'], 400);
    }

    public function sessionStatus($sessionId)
    {
        $session = TableSession::with(['orders.items.menuItem', 'payments', 'table'])
            ->findOrFail($sessionId);
        return response()->json(['session' => $session]);
    }

    public function findTable(Request $request, $slug)
    {
        $restaurant = Restaurant::where('restaurant_link', $slug)
            ->where('subscription_status', 'active')
            ->first();

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        $validated = $request->validate([
            'table_number' => 'required|integer|min:1',
        ]);

        $table = RestaurantTable::where('restaurant_id', $restaurant->id)
            ->where('table_number', $validated['table_number'])
            ->first();

        if (!$table) {
            return response()->json(['message' => 'Table number not found. Please check your table and try again.'], 404);
        }

        return response()->json([
            'redirect' => route('public.scan', $table->qr_token),
            'table_number' => $table->table_number,
        ]);
    }
}
