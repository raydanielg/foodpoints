<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::withCount('restaurants')->orderBy('price')->get();
        return view('admin.plans.index', compact('plans'));
    }

    public function show(Plan $plan)
    {
        return view('admin.plans.show', compact('plan'));
    }

    public function create()
    {
        return view('admin.plans.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'currency' => 'required|string|max:10',
            'features' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $features = $request->filled('features')
            ? array_filter(array_map('trim', explode("\n", $request->features)))
            : null;

        $plan = Plan::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'currency' => $validated['currency'],
            'features' => $features,
            'is_active' => $request->has('is_active'),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Plan created successfully.', 'plan' => $plan]);
        }

        return redirect()->route('admin.plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(Plan $plan)
    {
        return view('admin.plans.edit', compact('plan'));
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'currency' => 'required|string|max:10',
            'features' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $features = $request->filled('features')
            ? array_filter(array_map('trim', explode("\n", $request->features)))
            : null;

        $plan->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'currency' => $validated['currency'],
            'features' => $features,
            'is_active' => $request->has('is_active'),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Plan updated successfully.', 'plan' => $plan]);
        }

        return redirect()->route('admin.plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->restaurants()->exists()) {
            if (request()->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Cannot delete a plan that has restaurants assigned.'], 422);
            }
            return redirect()->back()->with('error', 'Cannot delete a plan that has restaurants assigned.');
        }

        $plan->delete();

        if (request()->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Plan deleted successfully.']);
        }

        return redirect()->route('admin.plans.index')->with('success', 'Plan deleted successfully.');
    }
}
