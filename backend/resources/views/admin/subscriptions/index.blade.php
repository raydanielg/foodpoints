@extends('admin.layout')

@section('title', 'Subscriptions — FoodPoint Admin')
@section('page_title', 'Subscriptions')

@section('content')
<div class="mb-6">
    <h2 class="text-xl font-bold text-gray-900">Subscriptions</h2>
    <p class="text-sm text-gray-400">Track and manage restaurant subscription payments</p>
</div>

{{-- Expiring soon --}}
@if ($expiringSoon->count() > 0)
<div class="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    <div>
        <p class="font-semibold">{{ $expiringSoon->count() }} subscription(s) expiring within 7 days</p>
        <p class="text-xs mt-0.5">Contact these restaurants to arrange payment before expiry.</p>
    </div>
</div>
@endif

{{-- Expired --}}
@if ($expired->count() > 0)
<div class="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
    <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <div>
        <p class="font-semibold">{{ $expired->count() }} subscription(s) have expired</p>
        <p class="text-xs mt-0.5">These restaurants need payment to continue using the platform.</p>
    </div>
</div>
@endif

<div class="bg-white rounded-xl border overflow-hidden">
    <div class="px-5 py-4 border-b"><h3 class="text-sm font-semibold text-gray-900">All Subscriptions</h3></div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead><tr class="text-left text-xs text-gray-500 bg-gray-50/50">
                <th class="px-5 py-2.5 font-medium">Restaurant</th>
                <th class="px-5 py-2.5 font-medium">Plan</th>
                <th class="px-5 py-2.5 font-medium">Price</th>
                <th class="px-5 py-2.5 font-medium">Status</th>
                <th class="px-5 py-2.5 font-medium">Expires</th>
                <th class="px-5 py-2.5 font-medium">Actions</th>
            </tr></thead>
            <tbody>
                @forelse ($restaurants as $restaurant)
                <tr class="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td class="px-5 py-2.5"><a href="{{ route('admin.restaurants.show', $restaurant) }}" class="text-xs font-medium text-gray-900 hover:text-emerald-600">{{ $restaurant->name }}</a></td>
                    <td class="px-5 py-2.5 text-xs text-gray-700">{{ $restaurant->plan?->name ?: '—' }}</td>
                    <td class="px-5 py-2.5 text-xs text-gray-700">{{ $restaurant->plan ? number_format($restaurant->plan->price) . ' ' . $restaurant->plan->currency : '—' }}</td>
                    <td class="px-5 py-2.5">
                        @if ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->isPast())
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-100">Expired</span>
                        @elseif ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->lte(now()->addDays(7)))
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">Expiring Soon</span>
                        @else
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium {{ $restaurant->subscription_status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100' }}">{{ ucfirst($restaurant->subscription_status) }}</span>
                        @endif
                    </td>
                    <td class="px-5 py-2.5 text-xs text-gray-500">{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</td>
                    <td class="px-5 py-2.5">
                        <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="px-2.5 py-1 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors">Manage</a>
                    </td>
                </tr>
                @empty
                <tr><td colspan="6" class="px-5 py-8 text-center text-gray-400 text-xs">No subscriptions found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{ $restaurants->links() }}
@endsection
