<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\User;
use App\Models\Withdrawal;
use App\Services\SnippeService;
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

    public function revenue(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant;

        $todayRevenue = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfDay())
            ->sum('amount');

        $weekRevenue = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfWeek())
            ->sum('amount');

        $monthRevenue = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $totalRevenue = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->sum('amount');

        $todayCommission = round($todayRevenue * 0.015, 2);
        $monthCommission = round($monthRevenue * 0.015, 2);
        $totalCommission = round($totalRevenue * 0.015, 2);

        $todayPayments = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        $pendingWithdrawals = Withdrawal::where('restaurant_id', $restaurant->id)
            ->where('status', 'pending')
            ->count();

        $completedWithdrawals = Withdrawal::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->count();

        // Daily revenue chart (last 7 days)
        $dailyRevenue = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total, COUNT(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get();

        // Payment methods distribution
        $methodStats = \App\Models\Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->selectRaw('method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('method')
            ->get();

        return response()->json([
            'revenue' => [
                'available_balance' => $restaurant->available_balance,
                'total_earned' => $restaurant->total_earned,
                'total_withdrawn' => $restaurant->total_withdrawn,
                'total_commission' => $restaurant->total_commission,
                'today_revenue' => $todayRevenue,
                'week_revenue' => $weekRevenue,
                'month_revenue' => $monthRevenue,
                'total_revenue' => $totalRevenue,
                'today_commission' => $todayCommission,
                'month_commission' => $monthCommission,
                'total_commission_calculated' => $totalCommission,
                'today_payments' => $todayPayments,
                'pending_withdrawals' => $pendingWithdrawals,
                'completed_withdrawals' => $completedWithdrawals,
                'daily_revenue' => $dailyRevenue,
                'method_stats' => $methodStats,
            ]
        ]);
    }

    public function withdrawalsIndex(Request $request): JsonResponse
    {
        $withdrawals = Withdrawal::where('restaurant_id', $request->user()->restaurant_id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json(['withdrawals' => $withdrawals]);
    }

    public function requestWithdrawal(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant;

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000',
        ]);

        $amount = (float) $validated['amount'];

        if ($amount > $restaurant->available_balance) {
            return response()->json(['message' => 'Insufficient balance. Your available balance is ' . number_format($restaurant->available_balance, 2) . ' TZS.'], 400);
        }

        if (!$restaurant->payout_recipient_name) {
            return response()->json(['message' => 'Please configure your payout settings first.'], 400);
        }

        if ($restaurant->payout_channel === 'mobile' && !$restaurant->payout_phone) {
            return response()->json(['message' => 'Please set your mobile money phone number in payout settings.'], 400);
        }

        if ($restaurant->payout_channel === 'bank' && (!$restaurant->payout_bank || !$restaurant->payout_bank_account)) {
            return response()->json(['message' => 'Please set your bank details in payout settings.'], 400);
        }

        $commission = round($amount * 0.015, 2);
        $netAmount = $amount - $commission;

        DB::beginTransaction();
        try {
            $withdrawal = Withdrawal::create([
                'restaurant_id' => $restaurant->id,
                'amount' => $amount,
                'commission_amount' => $commission,
                'net_amount' => $netAmount,
                'channel' => $restaurant->payout_channel,
                'recipient_phone' => $restaurant->payout_phone,
                'recipient_bank' => $restaurant->payout_bank,
                'recipient_account' => $restaurant->payout_bank_account,
                'recipient_name' => $restaurant->payout_recipient_name,
                'status' => 'pending',
            ]);

            $restaurant->decrement('available_balance', $amount);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create withdrawal request.'], 500);
        }

        $snippe = app(SnippeService::class);

        if (!$snippe->isConfigured()) {
            return response()->json([
                'withdrawal' => $withdrawal,
                'message' => 'Withdrawal request created. Payment gateway not configured — will be processed manually.',
            ], 201);
        }

        $payoutData = [
            'amount' => (int) round($netAmount),
            'recipient_name' => $restaurant->payout_recipient_name,
            'narration' => 'FoodPoint withdrawal #' . $withdrawal->id,
            'metadata' => [
                'withdrawal_id' => $withdrawal->id,
                'restaurant_id' => $restaurant->id,
            ],
        ];

        if ($restaurant->payout_channel === 'mobile') {
            $payoutData['recipient_phone'] = $restaurant->payout_phone;
            $result = $snippe->sendMobilePayout($payoutData);
        } else {
            $payoutData['recipient_bank'] = $restaurant->payout_bank;
            $payoutData['recipient_account'] = $restaurant->payout_bank_account;
            $result = $snippe->sendBankPayout($payoutData);
        }

        if ($result['success']) {
            $reference = $result['data']['reference'] ?? null;
            $withdrawal->update(['snippe_reference' => $reference]);

            if (($result['data']['status'] ?? '') === 'completed') {
                $withdrawal->update(['status' => 'completed', 'processed_at' => now()]);
                $restaurant->increment('total_withdrawn', $amount);
            }

            return response()->json([
                'withdrawal' => $withdrawal->fresh(),
                'message' => 'Withdrawal of ' . number_format($amount, 2) . ' TZS initiated successfully.',
            ], 201);
        } else {
            DB::beginTransaction();
            try {
                $withdrawal->update([
                    'status' => 'failed',
                    'failure_reason' => $result['message'] ?? 'Payout failed',
                ]);
                $restaurant->increment('available_balance', $amount);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
            }

            return response()->json([
                'message' => $result['message'] ?? 'Withdrawal failed. Your balance has been refunded.',
            ], 400);
        }
    }

    public function payoutSettings(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant;
        return response()->json([
            'payout' => [
                'payout_channel' => $restaurant->payout_channel,
                'payout_phone' => $restaurant->payout_phone,
                'payout_bank' => $restaurant->payout_bank,
                'payout_bank_account' => $restaurant->payout_bank_account,
                'payout_recipient_name' => $restaurant->payout_recipient_name,
            ]
        ]);
    }

    public function updatePayoutSettings(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant;

        $validated = $request->validate([
            'payout_channel' => 'required|in:mobile,bank',
            'payout_phone' => 'required_if:payout_channel,mobile|nullable|string|max:20',
            'payout_bank' => 'required_if:payout_channel,bank|nullable|string|max:50',
            'payout_bank_account' => 'required_if:payout_channel,bank|nullable|string|max:50',
            'payout_recipient_name' => 'required|string|max:255',
        ]);

        if ($validated['payout_channel'] === 'mobile' && !empty($validated['payout_phone'])) {
            $phone = preg_replace('/\s+/', '', $validated['payout_phone']);
            if (str_starts_with($phone, '0')) {
                $phone = '255' . substr($phone, 1);
            } elseif (str_starts_with($phone, '+255')) {
                $phone = substr($phone, 1);
            }
            $validated['payout_phone'] = $phone;
        }

        $restaurant->update($validated);

        return response()->json([
            'restaurant' => $restaurant->fresh(),
            'message' => 'Payout settings updated successfully.',
        ]);
    }
}
