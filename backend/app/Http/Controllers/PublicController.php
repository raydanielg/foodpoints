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
            abort(404, 'Invalid QR code');
        }

        $restaurant = Restaurant::find($table->restaurant_id);
        if (!$restaurant || $restaurant->subscription_status !== 'active') {
            abort(404, 'Restaurant not available');
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

        DB::beginTransaction();
        try {
            $payment = Payment::create([
                'session_id' => $session->id,
                'restaurant_id' => $session->restaurant_id,
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'split_type' => $validated['split_type'],
                'payer_label' => $validated['payer_label'] ?? null,
                'status' => $validated['method'] === 'cash' ? 'pending' : 'completed',
                'item_ids' => $validated['item_ids'] ?? null,
            ]);

            if ($payment->status === 'completed') {
                $session->increment('paid_amount', $validated['amount']);

                if ($validated['split_type'] === 'by_item' && !empty($validated['item_ids'])) {
                    OrderItem::whereIn('id', $validated['item_ids'])
                        ->update([
                            'paid' => true,
                            'paid_by_label' => $validated['payer_label'] ?? null,
                        ]);
                }

                if ($session->fresh()->paid_amount >= $session->total_amount - 0.01) {
                    $session->update([
                        'status' => 'closed',
                        'closed_at' => now(),
                    ]);
                    $session->table->update(['status' => 'free']);
                }
            }

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

    public function sessionStatus($sessionId)
    {
        $session = TableSession::with(['orders.items.menuItem', 'payments', 'table'])
            ->findOrFail($sessionId);
        return response()->json(['session' => $session]);
    }
}
