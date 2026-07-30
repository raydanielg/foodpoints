<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Plan;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::with('plan')
            ->whereNotNull('plan_id')
            ->orderBy('subscription_expires_at', 'asc')
            ->paginate(15);

        $expiringSoon = Restaurant::with('plan')
            ->whereNotNull('plan_id')
            ->where('subscription_expires_at', '<=', now()->addDays(7))
            ->where('subscription_status', 'active')
            ->get();

        $expired = Restaurant::with('plan')
            ->whereNotNull('plan_id')
            ->where('subscription_expires_at', '<', now())
            ->where('subscription_status', 'active')
            ->get();

        return view('admin.subscriptions.index', compact('restaurants', 'expiringSoon', 'expired'));
    }

    public function assign(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);

        $restaurant->update([
            'plan_id' => $plan->id,
            'subscription_status' => 'active',
            'subscription_expires_at' => now()->addDays($plan->duration_days),
        ]);

        return redirect()->back()->with('success', "Plan '{$plan->name}' assigned to {$restaurant->name}. Expires on " . $restaurant->subscription_expires_at->format('M d, Y'));
    }

    public function extend(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'days' => 'required|integer|min:1',
        ]);

        $base = $restaurant->subscription_expires_at && $restaurant->subscription_expires_at->isFuture()
            ? $restaurant->subscription_expires_at
            : now();

        $restaurant->update([
            'subscription_expires_at' => $base->addDays($validated['days']),
            'subscription_status' => 'active',
        ]);

        return redirect()->back()->with('success', "Subscription extended by {$validated['days']} days. New expiry: " . $restaurant->subscription_expires_at->format('M d, Y'));
    }

    public function pay(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);

        $base = $restaurant->subscription_expires_at && $restaurant->subscription_expires_at->isFuture()
            ? $restaurant->subscription_expires_at
            : now();

        $restaurant->update([
            'plan_id' => $plan->id,
            'subscription_status' => 'active',
            'subscription_expires_at' => $base->addDays($plan->duration_days),
        ]);

        return redirect()->back()->with('success', "Payment recorded. {$restaurant->name} subscribed to '{$plan->name}' until " . $restaurant->subscription_expires_at->format('M d, Y'));
    }

    public function suspend(Restaurant $restaurant)
    {
        $restaurant->update(['subscription_status' => 'suspended']);
        return redirect()->back()->with('success', "{$restaurant->name} has been suspended.");
    }

    public function activate(Restaurant $restaurant)
    {
        $restaurant->update(['subscription_status' => 'active']);
        return redirect()->back()->with('success', "{$restaurant->name} has been activated.");
    }
}
