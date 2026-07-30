<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Restaurant;
use App\Models\Withdrawal;
use App\Services\SnippeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OwnerDashboardController extends Controller
{
    private const COMMISSION_RATE = 0.015;

    public function dashboard()
    {
        $restaurant = Auth()->user()->restaurant;

        $todayRevenue = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfDay())
            ->sum('amount');

        $weekRevenue = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfWeek())
            ->sum('amount');

        $monthRevenue = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $totalRevenue = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->sum('amount');

        $todayCommission = $todayRevenue * self::COMMISSION_RATE;
        $monthCommission = $monthRevenue * self::COMMISSION_RATE;

        $todayPayments = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        $pendingWithdrawals = Withdrawal::where('restaurant_id', $restaurant->id)
            ->where('status', 'pending')
            ->count();

        // Daily revenue chart (last 7 days)
        $dailyRevenue = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total, COUNT(*) as count')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->keyBy('date');

        $revLabels = [];
        $revData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $revLabels[] = now()->subDays($i)->format('D');
            $revData[] = $dailyRevenue->has($date) ? (float) $dailyRevenue[$date]->total : 0;
        }

        // Payment methods distribution
        $methodStats = Payment::where('restaurant_id', $restaurant->id)
            ->where('status', 'completed')
            ->selectRaw('method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('method')
            ->get();

        $recentPayments = Payment::where('restaurant_id', $restaurant->id)
            ->with('session.table')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $recentWithdrawals = Withdrawal::where('restaurant_id', $restaurant->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $charts = [
            'revenue' => ['labels' => $revLabels, 'data' => $revData],
            'methods' => [
                'labels' => $methodStats->pluck('method')->map(fn($m) => ucfirst(str_replace('_', ' ', $m)))->toArray(),
                'data' => $methodStats->pluck('total')->map(fn($t) => (float) $t)->toArray(),
            ],
        ];

        return view('owner.dashboard', compact(
            'restaurant', 'todayRevenue', 'weekRevenue', 'monthRevenue', 'totalRevenue',
            'todayCommission', 'monthCommission', 'todayPayments', 'pendingWithdrawals',
            'recentPayments', 'recentWithdrawals', 'charts'
        ));
    }

    public function transactions()
    {
        $restaurant = Auth()->user()->restaurant;

        $payments = Payment::where('restaurant_id', $restaurant->id)
            ->with('session.table')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('owner.transactions', compact('restaurant', 'payments'));
    }

    public function withdrawals()
    {
        $restaurant = Auth()->user()->restaurant;

        $withdrawals = Withdrawal::where('restaurant_id', $restaurant->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('owner.withdrawals', compact('restaurant', 'withdrawals'));
    }

    public function payoutSettings()
    {
        $restaurant = Auth()->user()->restaurant;
        return view('owner.payout-settings', compact('restaurant'));
    }

    public function updatePayoutSettings(Request $request)
    {
        $restaurant = Auth()->user()->restaurant;

        $validated = $request->validate([
            'payout_channel' => 'required|in:mobile,bank',
            'payout_phone' => 'required_if:payout_channel,mobile|nullable|string|max:20',
            'payout_bank' => 'required_if:payout_channel,bank|nullable|string|max:50',
            'payout_bank_account' => 'required_if:payout_channel,bank|nullable|string|max:50',
            'payout_recipient_name' => 'required|string|max:255',
        ]);

        // Normalize phone
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

        return redirect()->route('owner.payout-settings')->with('success', 'Payout settings updated successfully.');
    }

    public function requestWithdrawal(Request $request)
    {
        $restaurant = Auth()->user()->restaurant;

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000',
        ]);

        $amount = (float) $validated['amount'];

        if ($amount > $restaurant->available_balance) {
            return back()->withErrors(['amount' => 'Insufficient balance. Your available balance is ' . number_format($restaurant->available_balance, 2) . ' TZS.'])->withInput();
        }

        // Check payout settings are configured
        if (!$restaurant->payout_recipient_name) {
            return back()->withErrors(['amount' => 'Please configure your payout settings first.'])->withInput();
        }

        if ($restaurant->payout_channel === 'mobile' && !$restaurant->payout_phone) {
            return back()->withErrors(['amount' => 'Please set your mobile money phone number in payout settings.'])->withInput();
        }

        if ($restaurant->payout_channel === 'bank' && (!$restaurant->payout_bank || !$restaurant->payout_bank_account)) {
            return back()->withErrors(['amount' => 'Please set your bank details in payout settings.'])->withInput();
        }

        $commission = round($amount * self::COMMISSION_RATE, 2);
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

            // Deduct from available balance immediately
            $restaurant->decrement('available_balance', $amount);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['amount' => 'Failed to create withdrawal request.'])->withInput();
        }

        // Process via Snippe
        $snippe = app(SnippeService::class);

        if (!$snippe->isConfigured()) {
            return redirect()->route('owner.withdrawals')->with('warning', 'Withdrawal request created but payment gateway is not configured. We will process it manually.');
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
                $withdrawal->update([
                    'status' => 'completed',
                    'processed_at' => now(),
                ]);
                $restaurant->increment('total_withdrawn', $amount);
            }

            return redirect()->route('owner.withdrawals')->with('success', 'Withdrawal of ' . number_format($amount, 2) . ' TZS initiated successfully. Funds will be sent to your ' . ($restaurant->payout_channel === 'mobile' ? 'mobile money' : 'bank account') . '.');
        } else {
            // Payout failed, refund balance
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

            return redirect()->route('owner.withdrawals')->with('error', 'Withdrawal failed: ' . ($result['message'] ?? 'Unable to process payout. Your balance has been refunded.'));
        }
    }
}
