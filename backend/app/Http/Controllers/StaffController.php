<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $staff = User::where('restaurant_id', $request->user()->restaurant_id)
            ->where('id', '!=', $request->user()->id)
            ->get();
        return response()->json(['staff' => $staff]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^255\d{9}$/|unique:users,phone',
            'password' => 'required|string|min:6',
            'role' => 'required|in:manager,waiter,kitchen',
        ]);

        $user = User::create([
            ...$validated,
            'restaurant_id' => $request->user()->restaurant_id,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json(['staff' => $user, 'token' => $token], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $staff = User::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|regex:/^255\d{9}$/|unique:users,phone,' . $id,
            'role' => 'sometimes|in:manager,waiter,kitchen',
            'password' => 'sometimes|string|min:6',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $staff->update($validated);
        return response()->json(['staff' => $staff]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $staff = User::where('restaurant_id', $request->user()->restaurant_id)
            ->findOrFail($id);
        $staff->delete();
        return response()->json(['message' => 'Staff member removed']);
    }
}
