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
            <button onclick="toggleActive({{ $plan->id }}, this)" class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors border {{ $plan->is_active ? 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100' }}">
                {{ $plan->is_active ? 'Deactivate' : 'Activate' }}
            </button>
            @if ($plan->restaurants_count === 0)
            <button onclick="deletePlan({{ $plan->id }})" class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-md transition-colors">Delete</button>
            @endif
        </div>
    </div>
    @empty
    <div class="col-span-full bg-white rounded-xl border p-12 text-center">
        <p class="text-sm text-gray-400">No plans yet. Click "New Plan" to create one.</p>
    </div>
    @endforelse
</div>

<div id="toastContainer" class="fixed top-20 right-6 z-[60] space-y-2"></div>
@endsection

@push('scripts')
<script>
async function deletePlan(id) {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
        const res = await fetch('/plans/' + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json',
            },
        });

        const data = await res.json();

        if (res.ok && data.success) {
            showToast(data.message, 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(data.message || 'Failed to delete plan.', 'error');
        }
    } catch (err) {
        showToast('Network error.', 'error');
    }
}

function showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const colors = type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500';
    toast.className = `flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg border ${colors} transition-all`;
    toast.style.cssText = 'animation: fadeIn 0.2s ease-out both;';
    const icon = type === 'success'
        ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
        : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    toast.innerHTML = icon + '<span>' + msg + '</span>';
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}
</script>
@endpush
