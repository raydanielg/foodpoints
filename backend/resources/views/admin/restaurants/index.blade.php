@extends('admin.layout')

@section('title', 'Restaurants — FoodPoint Admin')
@section('page_title', 'Restaurants')

@section('content')

{{-- Filters --}}
<form method="GET" class="flex flex-wrap gap-2 mb-4 items-center">
    <input type="text" name="search" class="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" placeholder="Search name, owner, phone..." value="{{ request('search') }}">
    <select name="status" class="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500">
        <option value="">All Status</option>
        <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
        <option value="suspended" {{ request('status') === 'suspended' ? 'selected' : '' }}>Suspended</option>
        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
    </select>
    <select name="kyc" class="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500">
        <option value="">All KYC</option>
        <option value="approved" {{ request('kyc') === 'approved' ? 'selected' : '' }}>Approved</option>
        <option value="pending" {{ request('kyc') === 'pending' ? 'selected' : '' }}>Pending</option>
        <option value="rejected" {{ request('kyc') === 'rejected' ? 'selected' : '' }}>Rejected</option>
    </select>
    <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Filter</button>
    <a href="{{ route('admin.restaurants.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Reset</a>
</form>

<div class="bg-white rounded-xl border overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead><tr class="text-left text-xs text-gray-500 bg-gray-50/50">
                <th class="px-5 py-2.5 font-medium">Name</th>
                <th class="px-5 py-2.5 font-medium">Phone</th>
                <th class="px-5 py-2.5 font-medium">Owner</th>
                <th class="px-5 py-2.5 font-medium">Plan</th>
                <th class="px-5 py-2.5 font-medium">Subscription</th>
                <th class="px-5 py-2.5 font-medium">KYC</th>
                <th class="px-5 py-2.5 font-medium">Expires</th>
                <th class="px-5 py-2.5 font-medium">Actions</th>
            </tr></thead>
            <tbody>
                @forelse ($restaurants as $restaurant)
                <tr class="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td class="px-5 py-2.5"><a href="{{ route('admin.restaurants.show', $restaurant) }}" class="text-xs font-medium text-gray-900 hover:text-emerald-600">{{ $restaurant->name }}</a></td>
                    <td class="px-5 py-2.5 text-xs text-gray-500">{{ $restaurant->users->first()?->phone ?: '—' }}</td>
                    <td class="px-5 py-2.5 text-xs text-gray-700">{{ $restaurant->owner_name ?: '—' }}</td>
                    <td class="px-5 py-2.5 text-xs text-gray-700">{{ $restaurant->plan?->name ?: '—' }}</td>
                    <td class="px-5 py-2.5">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium {{ $restaurant->subscription_status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ($restaurant->subscription_status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100') }}">{{ ucfirst($restaurant->subscription_status) }}</span>
                    </td>
                    <td class="px-5 py-2.5">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium {{ $restaurant->kyc_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ($restaurant->kyc_status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100') }}">{{ ucfirst($restaurant->kyc_status) }}</span>
                    </td>
                    <td class="px-5 py-2.5 text-xs text-gray-500">{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</td>
                    <td class="px-5 py-2.5">
                        <div class="flex gap-1">
                            <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="px-2.5 py-1 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors">View</a>
                            <a href="{{ route('admin.restaurants.edit', $restaurant) }}" class="px-2.5 py-1 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors">Edit</a>
                            <form method="POST" action="{{ route('admin.restaurants.toggleStatus', $restaurant) }}" style="display:inline;" onsubmit="return confirm('Toggle status?')">
                                @csrf
                                <button type="submit" class="px-2.5 py-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-md transition-colors">{{ $restaurant->subscription_status === 'active' ? 'Suspend' : 'Activate' }}</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr><td colspan="8" class="px-5 py-8 text-center text-gray-400 text-xs">No restaurants found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{ $restaurants->links() }}
@endsection
