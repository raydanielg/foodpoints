<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Restaurant;
use App\Models\Withdrawal;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index()
    {
        // Overall stats
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $totalCommission = Restaurant::sum('total_commission');
        $totalWithdrawn = Restaurant::sum('total_withdrawn');
        $totalAvailable = Restaurant::sum('available_balance');

        $todayRevenue = Payment::where('status', 'completed')
            ->where('created_at', '>=', now()->startOfDay())
            ->sum('amount');

        $monthRevenue = Payment::where('status', 'completed')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('amount');

        $todayCommission = round($todayRevenue * 0.015, 2);
        $monthCommission = round($monthRevenue * 0.015, 2);

        $pendingWithdrawals = Withdrawal::where('status', 'pending')->count();
        $completedWithdrawals = Withdrawal::where('status', 'completed')->count();
        $failedWithdrawals = Withdrawal::where('status', 'failed')->count();

        $totalWithdrawalsAmount = Withdrawal::where('status', 'completed')->sum('amount');
        $totalWithdrawalsCommission = Withdrawal::where('status', 'completed')->sum('commission_amount');

        // Revenue chart (last 7 days)
        $revenue = Payment::selectRaw('DATE(created_at) as date, SUM(amount) as total, COUNT(*) as count')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->keyBy('date');

        $revLabels = [];
        $revData = [];
        $commissionData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $revLabels[] = now()->subDays($i)->format('D');
            $revData[] = $revenue->has($date) ? (float) $revenue[$date]->total : 0;
            $commissionData[] = $revenue->has($date) ? round($revenue[$date]->total * 0.015, 2) : 0;
        }

        // Top restaurants by revenue
        $topRestaurants = Restaurant::withCount(['payments as completed_payments' => function ($q) {
            $q->where('status', 'completed');
        }])
            ->withSum(['payments as revenue' => function ($q) {
                $q->where('status', 'completed');
            }], 'amount')
            ->having('revenue', '>', 0)
            ->orderByDesc('revenue')
            ->limit(10)
            ->get();

        // Recent withdrawals
        $recentWithdrawals = Withdrawal::with('restaurant')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $stats = [
            'total_revenue' => $totalRevenue,
            'total_commission' => $totalCommission,
            'total_withdrawn' => $totalWithdrawn,
            'total_available' => $totalAvailable,
            'today_revenue' => $todayRevenue,
            'month_revenue' => $monthRevenue,
            'today_commission' => $todayCommission,
            'month_commission' => $monthCommission,
            'pending_withdrawals' => $pendingWithdrawals,
            'completed_withdrawals' => $completedWithdrawals,
            'failed_withdrawals' => $failedWithdrawals,
            'total_withdrawals_amount' => $totalWithdrawalsAmount,
            'total_withdrawals_commission' => $totalWithdrawalsCommission,
        ];

        $charts = [
            'revenue' => ['labels' => $revLabels, 'data' => $revData],
            'commission' => ['labels' => $revLabels, 'data' => $commissionData],
        ];

        $snippeConfigured = app(\App\Services\SnippeService::class)->isConfigured();

        return view('admin.finance.index', compact(
            'stats', 'charts', 'topRestaurants', 'recentWithdrawals', 'snippeConfigured'
        ));
    }

    public function withdrawals()
    {
        $withdrawals = Withdrawal::with('restaurant')
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        return view('admin.finance.withdrawals', compact('withdrawals'));
    }

    public function snippeSettings()
    {
        $config = [
            'api_key' => config('snippe.api_key') ? '••••••••' . substr(config('snippe.api_key'), -4) : '',
            'base_url' => config('snippe.base_url'),
            'api_version' => config('snippe.api_version'),
            'webhook_secret' => config('snippe.webhook_secret') ? '••••••••' : '',
            'configured' => app(\App\Services\SnippeService::class)->isConfigured(),
        ];

        return view('admin.finance.snippe', compact('config'));
    }

    public function updateSnippeSettings(Request $request)
    {
        $validated = $request->validate([
            'snippe_api_key' => 'nullable|string|max:255',
            'snippe_base_url' => 'required|string|max:255',
            'snippe_api_version' => 'required|string|max:50',
            'snippe_webhook_secret' => 'nullable|string|max:255',
        ]);

        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        $replacements = [
            'SNIPPE_API_KEY' => $validated['snippe_api_key'],
            'SNIPPE_BASE_URL' => $validated['snippe_base_url'],
            'SNIPPE_API_VERSION' => $validated['snippe_api_version'],
            'SNIPPE_WEBHOOK_SECRET' => $validated['snippe_webhook_secret'],
        ];

        foreach ($replacements as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $pattern = "/^{$key}=.*/m";
            $replacement = "{$key}={$value}";

            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                $envContent .= "\n{$replacement}";
            }
        }

        file_put_contents($envPath, $envContent);

        return redirect()->route('admin.finance.snippe')->with('success', 'Snippe settings updated. Configuration cache cleared.');
    }
}
