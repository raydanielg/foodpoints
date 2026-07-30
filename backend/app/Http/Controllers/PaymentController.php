<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\TableSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // Customer: process payment
    public function store(Request $request): JsonResponse
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

                // Mark items as paid if split by item
                if ($validated['split_type'] === 'by_item' && !empty($validated['item_ids'])) {
                    OrderItem::whereIn('id', $validated['item_ids'])
                        ->update([
                            'paid' => true,
                            'paid_by_label' => $validated['payer_label'] ?? null,
                        ]);
                }

                // Close session if fully paid
                if ($session->fresh()->paid_amount >= $session->total_amount - 0.01) {
                    $session->update([
                        'status' => 'closed',
                        'closed_at' => now(),
                    ]);
                    $session->table->update(['status' => 'free']);
                }
            }

            DB::commit();
            return response()->json(['payment' => $payment->fresh()], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Payment failed'], 500);
        }
    }

    // Waiter: confirm cash payment
    public function confirmCash(Request $request, $id): JsonResponse
    {
        $payment = Payment::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        if ($payment->method !== 'cash' || $payment->status !== 'pending') {
            return response()->json(['message' => 'Invalid payment for confirmation'], 400);
        }

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

            if ($session->fresh()->paid_amount >= $session->total_amount - 0.01) {
                $session->update([
                    'status' => 'closed',
                    'closed_at' => now(),
                ]);
                $session->table->update(['status' => 'free']);
            }

            DB::commit();
            return response()->json(['payment' => $payment->fresh()]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Confirmation failed'], 500);
        }
    }

    // Get session payments
    public function sessionPayments($sessionId): JsonResponse
    {
        $payments = Payment::where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['payments' => $payments]);
    }
}
