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
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (Auth::user()->role !== 'super_admin') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            throw ValidationException::withMessages([
                'email' => ['Access denied. Only super admins can access this panel.'],
            ]);
        }

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

        return view('admin.dashboard', compact('stats', 'restaurants'));
    }
}
