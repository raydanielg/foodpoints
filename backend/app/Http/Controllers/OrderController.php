<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TableSession;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Customer: place order
    public function store(Request $request): JsonResponse
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
                $menuItem = \App\Models\MenuItem::find($item['menu_item_id']);
                $orderItem = OrderItem::create([
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

            return response()->json(['order' => $order->load('items.menuItem')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create order'], 500);
        }
    }

    // Kitchen: update order status
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $order = Order::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:received,preparing,ready,served',
        ]);

        $order->update(['status' => $validated['status']]);

        if ($validated['status'] === 'served') {
            $order->items()->update(['served' => true]);
        }

        return response()->json(['order' => $order->load('items.menuItem')]);
    }

    // Waiter: mark item as served
    public function markItemServed(Request $request, $itemId): JsonResponse
    {
        $item = OrderItem::whereHas('order', function ($q) use ($request) {
            $q->where('restaurant_id', $request->user()->restaurant_id);
        })->findOrFail($itemId);

        $item->update(['served' => true]);
        return response()->json(['item' => $item]);
    }

    // Kitchen: get all active orders
    public function kitchenOrders(Request $request): JsonResponse
    {
        $orders = Order::where('restaurant_id', $request->user()->restaurant_id)
            ->whereIn('status', ['received', 'preparing', 'ready'])
            ->with(['items.menuItem', 'session.table'])
            ->orderBy('created_at')
            ->get();
        return response()->json(['orders' => $orders]);
    }

    // Get session orders (customer view)
    public function sessionOrders($sessionId): JsonResponse
    {
        $session = TableSession::with(['orders.items.menuItem', 'table', 'payments'])
            ->findOrFail($sessionId);
        return response()->json(['session' => $session]);
    }
}
