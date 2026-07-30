<?php

namespace App\Http\Controllers;

use App\Models\RestaurantTable;
use App\Models\TableSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class TableController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tables = RestaurantTable::where('restaurant_id', $request->user()->restaurant_id)
            ->orderBy('table_number')
            ->get();
        return response()->json(['tables' => $tables]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:50',
        ]);

        $table = RestaurantTable::create([
            'table_number' => $validated['table_number'],
            'restaurant_id' => $request->user()->restaurant_id,
            'qr_token' => Str::random(32),
        ]);
        return response()->json(['table' => $table], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $table = RestaurantTable::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'table_number' => 'sometimes|string|max:50',
            'status' => 'sometimes|in:free,occupied',
        ]);

        $table->update($validated);
        return response()->json(['table' => $table]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $table = RestaurantTable::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);
        $table->delete();
        return response()->json(['message' => 'Table deleted']);
    }

    public function regenerateQr(Request $request, $id): JsonResponse
    {
        $table = RestaurantTable::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);
        $table->update(['qr_token' => Str::random(32)]);
        return response()->json(['table' => $table]);
    }

    // Customer: scan QR -> open/join session
    public function scanQr(Request $request, $qrToken): JsonResponse
    {
        $table = RestaurantTable::where('qr_token', $qrToken)->first();
        if (!$table) {
            return response()->json(['message' => 'Invalid QR code'], 404);
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

        $menu = \App\Models\MenuCategory::where('restaurant_id', $table->restaurant_id)
            ->with(['items' => function ($q) {
                $q->where('is_available', true);
            }])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'table' => $table,
            'session' => $session->load(['orders.items.menuItem']),
            'menu' => $menu,
            'restaurant' => \App\Models\Restaurant::find($table->restaurant_id),
        ]);
    }
}
