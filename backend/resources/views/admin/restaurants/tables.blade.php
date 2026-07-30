@extends('admin.layout')

@section('title', $restaurant->name . ' Tables — FoodPoint Admin')
@section('page_title', $restaurant->name . ' — Tables')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">Restaurant Tables</h2>
        <p class="text-sm text-gray-400">{{ $restaurant->name }}</p>
    </div>
    <div class="flex gap-2">
        <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Back to Restaurant</a>
    </div>
</div>

{{-- Stat Cards --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl border border-emerald-500 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-emerald-100">Total Tables</span>
            <p class="text-xl font-bold mt-1">{{ $tables->count() }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl border border-sky-400 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-sky-100">Active Sessions</span>
            <p class="text-xl font-bold mt-1">{{ $activeSessions }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl border border-violet-400 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-violet-100">Total Orders</span>
            <p class="text-xl font-bold mt-1">{{ number_format($totalOrders) }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl border border-amber-300 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-amber-50">Total Revenue</span>
            <p class="text-xl font-bold mt-1">{{ number_format($totalRevenue) }} {{ $restaurant->currency }}</p>
        </div>
    </div>
</div>

{{-- Tables Grid --}}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    @forelse ($tables as $table)
    @php
        $openSession = $table->sessions->first();
        $currentOrders = $openSession ? $openSession->orders : collect();
        $currentTotal = $openSession ? $openSession->total_amount : 0;
    @endphp
    <div class="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
        {{-- Card Header --}}
        <div class="p-4 border-b border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg {{ $table->status === 'occupied' ? 'bg-amber-100' : 'bg-emerald-100' }} flex items-center justify-center">
                    <svg class="w-5 h-5 {{ $table->status === 'occupied' ? 'text-amber-600' : 'text-emerald-600' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">Table {{ $table->table_number }}</h3>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium {{ $table->status === 'occupied' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100' }}">{{ ucfirst($table->status) }}</span>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[10px] text-gray-400">Sessions</p>
                <p class="text-sm font-bold text-gray-700">{{ $table->total_sessions }}</p>
            </div>
        </div>

        {{-- QR Token --}}
        <div class="px-4 py-3 bg-gray-50/50 border-b border-gray-50">
            <div class="flex items-center justify-between">
                <div class="min-w-0">
                    <p class="text-[10px] text-gray-400 font-medium">QR Token</p>
                    <p class="text-xs font-mono text-gray-600 truncate">{{ $table->qr_token }}</p>
                </div>
                <a href="{{ route('public.scan', $table->qr_token) }}" target="_blank" class="px-2.5 py-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 flex-shrink-0">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-10L10 14"/></svg>
                    Open
                </a>
            </div>
        </div>

        {{-- Current Session Details --}}
        @if ($openSession)
        <div class="p-4">
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold text-gray-700">Current Session #{{ $openSession->id }}</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100">Open</span>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-gray-50 rounded-lg p-2">
                    <p class="text-[10px] text-gray-400">Total Bill</p>
                    <p class="text-sm font-bold text-emerald-600">{{ number_format($currentTotal) }} {{ $restaurant->currency }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-2">
                    <p class="text-[10px] text-gray-400">Paid</p>
                    <p class="text-sm font-bold text-gray-700">{{ number_format($openSession->paid_amount) }} {{ $restaurant->currency }}</p>
                </div>
            </div>
            @if ($currentOrders->count() > 0)
            <div class="space-y-1.5">
                <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Orders ({{ $currentOrders->count() }})</p>
                @foreach ($currentOrders as $order)
                <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-1.5">
                        <span class="font-semibold text-gray-600">#{{ $order->id }}</span>
                        @php $itemCount = $order->items->count(); @endphp
                        <span class="text-gray-400">{{ $itemCount }} item(s)</span>
                    </div>
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium
                        {{ $order->status === 'received' ? 'bg-sky-50 text-sky-700' : '' }}
                        {{ $order->status === 'preparing' ? 'bg-amber-50 text-amber-700' : '' }}
                        {{ $order->status === 'ready' ? 'bg-violet-50 text-violet-700' : '' }}
                        {{ $order->status === 'served' ? 'bg-emerald-50 text-emerald-700' : '' }}
                    ">{{ ucfirst($order->status) }}</span>
                </div>
                @endforeach
            </div>
            @else
            <p class="text-xs text-gray-400 text-center py-2">No orders yet in this session</p>
            @endif
        </div>
        @else
        <div class="p-4 text-center">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-xs text-gray-400">No active session</p>
        </div>
        @endif
    </div>
    @empty
    <div class="col-span-full bg-white rounded-xl border p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <h3 class="text-sm font-bold text-gray-700">No Tables Yet</h3>
        <p class="text-xs text-gray-400 mt-1">This restaurant hasn't created any tables yet.</p>
    </div>
    @endforelse
</div>
@endsection
