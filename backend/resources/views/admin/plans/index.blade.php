@extends('admin.layout')

@section('title', 'Plans — FoodPoint Admin')
@section('page_title', 'Subscription Plans')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">Subscription Plans</h2>
        <p class="text-sm text-gray-400">Create and manage pricing plans for restaurants</p>
    </div>
    <a href="{{ route('admin.plans.create') }}" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        New Plan
    </a>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    @forelse ($plans as $plan)
    <div class="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
        <div class="p-5 border-b border-gray-50">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-base font-bold text-gray-900">{{ $plan->name }}</h3>
                @if (!$plan->is_active)
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-100">Inactive</span>
                @else
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                @endif
            </div>
            <div class="text-2xl font-extrabold text-emerald-600">{{ number_format($plan->price) }} {{ $plan->currency }}<span class="text-xs font-medium text-gray-400"> / {{ $plan->duration_days }} days</span></div>
        </div>
        <div class="p-5">
            @if ($plan->description)
            <p class="text-xs text-gray-500 mb-3">{{ $plan->description }}</p>
            @endif
            @if ($plan->features)
            <ul class="space-y-1.5">
                @foreach ($plan->features as $feature)
                <li class="text-xs text-gray-600 flex items-start gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    {{ $feature }}
                </li>
                @endforeach
            </ul>
            @endif
            <div class="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                <strong class="text-gray-700">{{ $plan->restaurants_count }}</strong> restaurant(s) subscribed
            </div>
        </div>
        <div class="px-5 py-3 border-t border-gray-50 flex gap-2">
            <a href="{{ route('admin.plans.edit', $plan) }}" class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors">Edit</a>
            @if ($plan->restaurants_count === 0)
            <form method="POST" action="{{ route('admin.plans.destroy', $plan) }}" onsubmit="return confirm('Delete this plan?')" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit" class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-md transition-colors">Delete</button>
            </form>
            @endif
        </div>
    </div>
    @empty
    <div class="col-span-full bg-white rounded-xl border p-12 text-center">
        <p class="text-sm text-gray-400">No plans yet. Click "New Plan" to create one.</p>
    </div>
    @endforelse
</div>
@endsection
