@extends('admin.layout')

@section('title', $restaurant->name . ' — FoodPoint Admin')
@section('page_title', $restaurant->name)

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">{{ $restaurant->name }}</h2>
        <p class="text-sm text-gray-400">Restaurant details and management</p>
    </div>
    <div class="flex gap-2">
        <a href="{{ route('admin.restaurants.tables', $restaurant) }}" class="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors">Tables</a>
        <a href="{{ route('admin.restaurants.edit', $restaurant) }}" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Edit</a>
        <a href="{{ route('admin.restaurants.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Back</a>
    </div>
</div>

{{-- Stat cards --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl border border-emerald-500 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-emerald-100">Subscription</span>
            <p class="text-lg font-bold mt-1">{{ ucfirst($restaurant->subscription_status) }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl border border-sky-400 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-sky-100">KYC Status</span>
            <p class="text-lg font-bold mt-1">{{ ucfirst($restaurant->kyc_status) }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl border border-violet-400 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-violet-100">Current Plan</span>
            <p class="text-lg font-bold mt-1">{{ $restaurant->plan?->name ?: 'No Plan' }}</p>
        </div>
    </div>
    <div class="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl border border-amber-300 p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="relative z-10">
            <span class="text-[10px] font-medium text-amber-50">Expires</span>
            <p class="text-lg font-bold mt-1">{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</p>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    {{-- Restaurant Info --}}
    <div class="bg-white rounded-xl border p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Restaurant Information</h3>
        <div class="space-y-3">
            <div class="flex justify-between text-sm"><span class="text-gray-400">Name</span><span class="text-gray-900 font-medium">{{ $restaurant->name }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Phone</span><span class="text-gray-900 font-medium">{{ $restaurant->phone ?: '—' }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Address</span><span class="text-gray-900 font-medium">{{ $restaurant->address ?: '—' }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Currency</span><span class="text-gray-900 font-medium">{{ $restaurant->currency }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">VAT (%)</span><span class="text-gray-900 font-medium">{{ $restaurant->vat_percent }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Link</span><span class="text-gray-900 font-medium">{{ $restaurant->restaurant_link ?: '—' }}</span></div>
        </div>
    </div>

    {{-- KYC Details --}}
    <div class="bg-white rounded-xl border p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">KYC Details</h3>
        <div class="space-y-3">
            <div class="flex justify-between text-sm"><span class="text-gray-400">Owner Name</span><span class="text-gray-900 font-medium">{{ $restaurant->owner_name ?: '—' }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Owner Phone</span><span class="text-gray-900 font-medium">{{ $restaurant->owner_phone ?: '—' }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">ID Type</span><span class="text-gray-900 font-medium">{{ ucfirst(str_replace('_', ' ', $restaurant->owner_id_type ?: '—')) }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">ID Number</span><span class="text-gray-900 font-medium">{{ $restaurant->owner_id_number ?: '—' }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">Business Type</span><span class="text-gray-900 font-medium">{{ ucfirst($restaurant->business_type ?: '—') }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-gray-400">TIN Number</span><span class="text-gray-900 font-medium">{{ $restaurant->tin_number ?: '—' }}</span></div>
        </div>
    </div>
</div>

{{-- Users --}}
<div class="bg-white rounded-xl border overflow-hidden mb-6">
    <div class="px-5 py-4 border-b"><h3 class="text-sm font-semibold text-gray-900">Users</h3></div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead><tr class="text-left text-xs text-gray-500 bg-gray-50/50">
                <th class="px-5 py-2.5 font-medium">Name</th>
                <th class="px-5 py-2.5 font-medium">Phone</th>
                <th class="px-5 py-2.5 font-medium">Role</th>
            </tr></thead>
            <tbody>
                @forelse ($restaurant->users as $user)
                <tr class="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td class="px-5 py-2.5 text-xs text-gray-900">{{ $user->name }}</td>
                    <td class="px-5 py-2.5 text-xs text-gray-500">{{ $user->phone ?: '—' }}</td>
                    <td class="px-5 py-2.5"><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100">{{ ucfirst(str_replace('_', ' ', $user->role)) }}</span></td>
                </tr>
                @empty
                <tr><td colspan="3" class="px-5 py-8 text-center text-gray-400 text-xs">No users</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- Subscription Management --}}
<div class="bg-white rounded-xl border p-5 mb-6">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">Subscription Management</h3>
    <div class="flex flex-wrap gap-3">
        <form method="POST" action="{{ route('admin.subscriptions.pay', $restaurant) }}" class="flex gap-2 items-end">
            @csrf
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Record Payment & Assign Plan</label>
                <select name="plan_id" class="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500" required>
                    <option value="">Select Plan...</option>
                    @foreach (\App\Models\Plan::where('is_active', true)->orderBy('price')->get() as $plan)
                    <option value="{{ $plan->id }}" {{ $restaurant->plan_id === $plan->id ? 'selected' : '' }}>{{ $plan->name }} — {{ number_format($plan->price) }} {{ $plan->currency }} ({{ $plan->duration_days }} days)</option>
                    @endforeach
                </select>
            </div>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Record Payment</button>
        </form>
        <form method="POST" action="{{ route('admin.subscriptions.extend', $restaurant) }}" class="flex gap-2 items-end">
            @csrf
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Extend (days)</label>
                <input type="number" name="days" class="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 w-24" min="1" value="30" required>
            </div>
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Extend</button>
        </form>
        @if ($restaurant->subscription_status === 'active')
        <form method="POST" action="{{ route('admin.subscriptions.suspend', $restaurant) }}" style="display:inline;">
            @csrf
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors">Suspend</button>
        </form>
        @else
        <form method="POST" action="{{ route('admin.subscriptions.activate', $restaurant) }}" style="display:inline;">
            @csrf
            <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Activate</button>
        </form>
        @endif
    </div>
</div>

{{-- Danger Zone --}}
<div class="bg-white rounded-xl border border-red-100 p-5">
    <h3 class="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
    <form method="POST" action="{{ route('admin.restaurants.destroy', $restaurant) }}" onsubmit="return confirm('Are you sure? This will permanently delete the restaurant and all its data.')">
        @csrf
        @method('DELETE')
        <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete Restaurant</button>
    </form>
</div>
@endsection
