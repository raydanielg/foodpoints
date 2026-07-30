<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'avatar_url' => 'sometimes|nullable|string',
        ]);

        $user->update($validated);
        return response()->json(['user' => $user->load('restaurant')]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password' => $request->password]);
        return response()->json(['message' => 'Password changed successfully']);
    }
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'restaurant_name' => ['required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        DB::beginTransaction();
        try {
            // Generate unique restaurant link slug
            $baseSlug = \Illuminate\Support\Str::slug($validated['restaurant_name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Restaurant::where('restaurant_link', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $restaurant = Restaurant::create([
                'name' => $validated['restaurant_name'],
                'subscription_status' => 'active',
                'kyc_status' => 'pending',
                'restaurant_link' => $slug,
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'phone' => $validated['phone'] ?? null,
                'restaurant_id' => $restaurant->id,
                'role' => 'owner',
            ]);

            DB::commit();

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user->load('restaurant'),
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Registration failed'], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()->load('restaurant')]);
    }

    public function updateSubscription(Request $request): JsonResponse
    {
        $user = $request->user();
        $restaurant = $user->restaurant;

        $validated = $request->validate([
            'subscription_status' => 'required|in:active,suspended,pending',
        ]);

        $restaurant->update($validated);
        return response()->json(['restaurant' => $restaurant]);
    }
}
