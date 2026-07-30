<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        $query = Restaurant::with(['plan', 'users' => function ($q) {
            $q->where('role', 'owner')->limit(1);
        }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%")
                  ->orWhere('owner_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('subscription_status', $request->status);
        }

        if ($request->filled('kyc')) {
            $query->where('kyc_status', $request->kyc);
        }

        $restaurants = $query->orderBy('created_at', 'desc')->paginate(15);

        return view('admin.restaurants.index', compact('restaurants'));
    }

    public function show(Restaurant $restaurant)
    {
        $restaurant->load(['plan', 'users']);
        return view('admin.restaurants.show', compact('restaurant'));
    }

    public function edit(Restaurant $restaurant)
    {
        $plans = \App\Models\Plan::where('is_active', true)->orderBy('price')->get();
        return view('admin.restaurants.edit', compact('restaurant', 'plans'));
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'currency' => 'nullable|string|max:10',
            'vat_percent' => 'nullable|numeric|min:0|max:100',
            'subscription_status' => 'required|in:active,suspended,pending',
            'kyc_status' => 'required|in:pending,approved,rejected',
            'restaurant_link' => 'nullable|string|max:255',
        ]);

        $restaurant->update($validated);

        return redirect()->route('admin.restaurants.index')->with('success', 'Restaurant updated successfully.');
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        return redirect()->route('admin.restaurants.index')->with('success', 'Restaurant deleted successfully.');
    }

    public function toggleStatus(Restaurant $restaurant)
    {
        $restaurant->subscription_status = $restaurant->subscription_status === 'active' ? 'suspended' : 'active';
        $restaurant->save();

        return redirect()->back()->with('success', 'Restaurant status updated.');
    }
}
