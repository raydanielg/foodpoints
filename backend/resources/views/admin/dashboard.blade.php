@extends('admin.layout')

@section('title', 'Dashboard — FoodPoint Admin')
@section('page_title', 'Dashboard Overview')

@section('content')
@php
$fmt = fn($n) => $n >= 1000000000 ? number_format($n/1000000000,2).'B' : ($n >= 1000000 ? number_format($n/1000000,2).'M' : ($n >= 1000 ? number_format($n/1000,1).'K' : number_format($n)));
@endphp

{{-- Stats Cards --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    @foreach([
        ['label'=>'Total Restaurants','value'=>number_format($stats['total_restaurants']),'change'=>'Registered on platform','icon'=>'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4','from'=>'emerald-600','to'=>'emerald-700','border'=>'emerald-500','text'=>'emerald-100','sub'=>'emerald-200'],
        ['label'=>'Total Users','value'=>number_format($stats['total_users']),'change'=>'All system users','icon'=>'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z','from'=>'amber-400','to'=>'amber-500','border'=>'amber-300','text'=>'amber-50','sub'=>'amber-100'],
        ['label'=>'KYC Approved','value'=>number_format($stats['kyc_approved']),'change'=>($stats['kyc_pending'] ?? 0).' pending','icon'=>'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z','from'=>'sky-500','to'=>'sky-600','border'=>'sky-400','text'=>'sky-100','sub'=>'sky-200'],
        ['label'=>'Active Subscriptions','value'=>number_format($stats['active_subscriptions']),'change'=>($stats['expired'] ?? 0).' expired','icon'=>'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z','from'=>'violet-500','to'=>'violet-600','border'=>'violet-400','text'=>'violet-100','sub'=>'violet-200']
    ] as $card)
    <div class="bg-gradient-to-br from-{{ $card['from'] }} to-{{ $card['to'] }} rounded-xl border border-{{ $card['border'] }} p-4 text-white relative overflow-hidden hover:shadow-lg transition-shadow">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <div class="flex items-start justify-between mb-2">
                <span class="text-[10px] font-medium {{ $card['text'] }}">{{ $card['label'] }}</span>
                <svg class="w-4 h-4 {{ $card['sub'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $card['icon'] }}"/></svg>
            </div>
            <p class="text-xl font-bold tracking-tight text-white">{{ $card['value'] }}</p>
            <p class="text-[10px] {{ $card['sub'] }} font-medium mt-1">{{ $card['change'] }}</p>
        </div>
    </div>
    @endforeach
</div>

{{-- Subscription Alerts --}}
@if (($stats['expiring_soon'] ?? 0) > 0)
<div class="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    <div>
        <p class="font-semibold">{{ $stats['expiring_soon'] }} subscription(s) expiring within 7 days</p>
        <p class="text-xs mt-0.5">Contact these restaurants to arrange payment before expiry.</p>
    </div>
</div>
@endif
@if (($stats['expired'] ?? 0) > 0)
<div class="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
    <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <div>
        <p class="font-semibold">{{ $stats['expired'] }} subscription(s) have expired</p>
        <p class="text-xs mt-0.5">These restaurants need payment to continue using the platform.</p>
    </div>
</div>
@endif

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {{-- Recent Restaurants --}}
    <div class="bg-white rounded-xl border overflow-hidden">
        <div class="px-5 py-4 border-b flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">Recent Restaurants</h3>
            <a href="{{ route('admin.restaurants.index') }}" class="text-xs font-medium text-emerald-600 hover:text-emerald-700">View All</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead><tr class="text-left text-xs text-gray-500 bg-gray-50/50">
                    <th class="px-5 py-2.5 font-medium">Restaurant</th>
                    <th class="px-5 py-2.5 font-medium">Phone</th>
                    <th class="px-5 py-2.5 font-medium">Plan</th>
                    <th class="px-5 py-2.5 font-medium">Status</th>
                </tr></thead>
                <tbody>
                    @forelse ($restaurants as $restaurant)
                    <tr class="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td class="px-5 py-2.5">
                            <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="text-xs font-medium text-gray-900 hover:text-emerald-600">{{ $restaurant->name }}</a>
                        </td>
                        <td class="px-5 py-2.5 text-xs text-gray-500">{{ $restaurant->users->first()?->phone ?: '—' }}</td>
                        <td class="px-5 py-2.5 text-xs text-gray-700">{{ $restaurant->plan?->name ?: 'No Plan' }}</td>
                        <td class="px-5 py-2.5">
                            @if ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->isPast())
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-100">Expired</span>
                            @elseif ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->lte(now()->addDays(7)))
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">Expiring</span>
                            @elseif ($restaurant->subscription_status === 'active')
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                            @else
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-100">{{ ucfirst($restaurant->subscription_status) }}</span>
                            @endif
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="px-5 py-8 text-center text-gray-400 text-xs">No restaurants yet</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Quick Actions --}}
    <div class="bg-white rounded-xl border p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-3">
            <a href="{{ route('admin.plans.create') }}" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <span class="text-xs font-medium text-gray-700">New Plan</span>
            </a>
            <a href="{{ route('admin.restaurants.index') }}" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <div class="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>
                </div>
                <span class="text-xs font-medium text-gray-700">Restaurants</span>
            </a>
            <a href="{{ route('admin.plans.index') }}" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <div class="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <span class="text-xs font-medium text-gray-700">View Plans</span>
            </a>
            <a href="{{ route('admin.subscriptions.index') }}" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="text-xs font-medium text-gray-700">Subscriptions</span>
            </a>
        </div>
    </div>
</div>
@endsection
