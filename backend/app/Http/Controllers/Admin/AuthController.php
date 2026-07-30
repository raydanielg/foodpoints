<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()->role === 'super_admin') {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])
            ->orWhere('phone', $credentials['email'])
            ->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role !== 'super_admin') {
            throw ValidationException::withMessages([
                'email' => ['Access denied. Only super admins can access this panel.'],
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();
        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }

    public function dashboard()
    {
        $stats = [
            'total_restaurants' => Restaurant::count(),
            'total_users' => User::count(),
            'kyc_approved' => Restaurant::where('kyc_status', 'approved')->count(),
            'kyc_pending' => Restaurant::where('kyc_status', 'pending')->count(),
            'active_subscriptions' => Restaurant::where('subscription_status', 'active')->whereNotNull('plan_id')->count(),
            'expired' => Restaurant::where('subscription_expires_at', '<', now())->where('subscription_status', 'active')->count(),
            'expiring_soon' => Restaurant::where('subscription_expires_at', '<=', now()->addDays(7))->where('subscription_expires_at', '>', now())->where('subscription_status', 'active')->count(),
        ];

        $restaurants = Restaurant::with(['plan', 'users' => function ($q) {
            $q->where('role', 'owner')->limit(1);
        }])->orderBy('created_at', 'desc')->limit(10)->get();

        // Chart data: Restaurant registrations over last 7 days
        $registrations = \App\Models\Restaurant::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->keyBy('date');

        $regLabels = [];
        $regData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $regLabels[] = now()->subDays($i)->format('D');
            $regData[] = $registrations->has($date) ? $registrations[$date]->count : 0;
        }

        // Chart data: Plan distribution
        $planDist = \App\Models\Plan::withCount('restaurants')->having('restaurants_count', '>', 0)->get();
        $planLabels = $planDist->pluck('name')->toArray();
        $planData = $planDist->pluck('restaurants_count')->toArray();

        // Chart data: Revenue from payments (last 7 days)
        $revenue = \App\Models\Payment::selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->keyBy('date');

        $revLabels = [];
        $revData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $revLabels[] = now()->subDays($i)->format('D');
            $revData[] = $revenue->has($date) ? (float) $revenue[$date]->total : 0;
        }

        // Chart data: Subscription status distribution
        $subStats = [
            'active' => Restaurant::where('subscription_status', 'active')->count(),
            'suspended' => Restaurant::where('subscription_status', 'suspended')->count(),
            'pending' => Restaurant::where('subscription_status', 'pending')->count(),
        ];

        $charts = [
            'registrations' => ['labels' => $regLabels, 'data' => $regData],
            'revenue' => ['labels' => $revLabels, 'data' => $revData],
            'plans' => ['labels' => $planLabels, 'data' => $planData],
            'subscriptions' => ['labels' => array_keys($subStats), 'data' => array_values($subStats)],
        ];

        return view('admin.dashboard', compact('stats', 'restaurants', 'charts'));
    }
}
