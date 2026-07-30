<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class RestaurantController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurant = $user->restaurant;
        return response()->json(['restaurant' => $restaurant]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurant = $user->restaurant;

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'logo_url' => 'sometimes|nullable|string',
            'cover_url' => 'sometimes|nullable|string',
            'address' => 'sometimes|nullable|string',
            'phone' => 'sometimes|nullable|string',
            'currency' => 'sometimes|string|max:10',
            'vat_percent' => 'sometimes|numeric|min:0|max:100',
            'owner_name' => 'sometimes|nullable|string|max:255',
            'owner_phone' => 'sometimes|nullable|string|max:20',
            'owner_id_type' => 'sometimes|nullable|in:national_id,passport,driving_license',
            'owner_id_number' => 'sometimes|nullable|string|max:255',
            'business_type' => 'sometimes|nullable|in:individual,company,partnership',
            'tin_number' => 'sometimes|nullable|string|max:255',
        ]);

        $restaurant->update($validated);
        return response()->json(['restaurant' => $restaurant]);
    }

    public function submitKyc(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurant = $user->restaurant;

        $validated = $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_phone' => ['required', 'string', 'max:20'],
            'owner_id_type' => ['required', 'in:national_id,passport,driving_license'],
            'owner_id_number' => ['required', 'string', 'max:255'],
            'business_type' => ['required', 'in:individual,company,partnership'],
            'tin_number' => ['required', 'string', 'max:255'],
        ]);

        // Auto-approve KYC
        $restaurant->update([
            ...$validated,
            'kyc_status' => 'approved',
            'kyc_submitted_at' => now(),
            'kyc_approved_at' => now(),
        ]);

        return response()->json([
            'restaurant' => $restaurant->fresh(),
            'message' => 'KYC submitted and auto-approved successfully.',
        ]);
    }

    public function regenerateLink(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurant = $user->restaurant;

        $baseSlug = \Illuminate\Support\Str::slug($restaurant->name);
        $slug = $baseSlug;
        $counter = 1;
        while (Restaurant::where('restaurant_link', $slug)->where('id', '!=', $restaurant->id)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $restaurant->update(['restaurant_link' => $slug]);

        return response()->json([
            'restaurant' => $restaurant->fresh(),
            'message' => 'Restaurant link regenerated successfully.',
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurantId = $user->restaurant_id;

        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        $todayRevenue = DB::table('payments')
            ->where('restaurant_id', $restaurantId)
            ->where('status', 'completed')
            ->where('created_at', '>=', $today)
            ->sum('amount');

        $weekRevenue = DB::table('payments')
            ->where('restaurant_id', $restaurantId)
            ->where('status', 'completed')
            ->where('created_at', '>=', $thisWeek)
            ->sum('amount');

        $monthRevenue = DB::table('payments')
            ->where('restaurant_id', $restaurantId)
            ->where('status', 'completed')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount');

        $activeSessions = DB::table('table_sessions')
            ->where('restaurant_id', $restaurantId)
            ->where('status', 'open')
            ->count();

        $totalOrders = DB::table('orders')
            ->where('restaurant_id', $restaurantId)
            ->where('created_at', '>=', $today)
            ->count();

        $topSellers = DB::table('order_items')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.restaurant_id', $restaurantId)
            ->where('orders.created_at', '>=', $thisMonth)
            ->select('menu_items.name', DB::raw('SUM(order_items.quantity) as total_sold'), DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue'))
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        $recentOrders = DB::table('orders')
            ->join('table_sessions', 'orders.session_id', '=', 'table_sessions.id')
            ->join('restaurant_tables', 'table_sessions.table_id', '=', 'restaurant_tables.id')
            ->where('orders.restaurant_id', $restaurantId)
            ->select('orders.id', 'orders.status', 'orders.created_at', 'restaurant_tables.table_number')
            ->orderByDesc('orders.created_at')
            ->limit(10)
            ->get();

        $dailyRevenue = DB::table('payments')
            ->where('restaurant_id', $restaurantId)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as revenue'),
                DB::raw('COUNT(*) as payments_count')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        $ordersByStatus = DB::table('orders')
            ->where('restaurant_id', $restaurantId)
            ->where('created_at', '>=', $thisWeek)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'stats' => [
                'today_revenue' => $todayRevenue,
                'week_revenue' => $weekRevenue,
                'month_revenue' => $monthRevenue,
                'active_sessions' => $activeSessions,
                'total_orders_today' => $totalOrders,
                'top_sellers' => $topSellers,
                'recent_orders' => $recentOrders,
                'daily_revenue' => $dailyRevenue,
                'orders_by_status' => $ordersByStatus,
            ]
        ]);
    }

    public function paymentsIndex(Request $request): JsonResponse
    {
        $payments = \App\Models\Payment::where('restaurant_id', $request->user()->restaurant_id)
            ->with('session.table')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
        return response()->json(['payments' => $payments]);
    }
}
