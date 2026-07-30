<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OwnerAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()->role === 'owner') {
            return redirect()->route('owner.dashboard');
        }
        return view('owner.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $phone = $credentials['phone'];
        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '+255')) {
            $phone = substr($phone, 1);
        }

        $user = User::where('phone', $phone)->first();

        if (!$user || !\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'phone' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role !== 'owner') {
            throw ValidationException::withMessages([
                'phone' => ['Access denied. This portal is for restaurant owners only.'],
            ]);
        }

        if (!$user->restaurant) {
            throw ValidationException::withMessages([
                'phone' => ['No restaurant found for this account.'],
            ]);
        }

        if ($user->restaurant->subscription_status !== 'active') {
            throw ValidationException::withMessages([
                'phone' => ['Your restaurant subscription is not active. Please contact support.'],
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();
        return redirect()->intended(route('owner.dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('owner.login');
    }
}
