@extends('admin.layout')

@section('title', 'Edit ' . $restaurant->name . ' — FoodPoint Admin')
@section('page_title', 'Edit Restaurant')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">Edit Restaurant</h2>
        <p class="text-sm text-gray-400">{{ $restaurant->name }}</p>
    </div>
    <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Back</a>
</div>

<div class="bg-white rounded-xl border p-6 max-w-2xl">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">Restaurant Details</h3>
    <form method="POST" action="{{ route('admin.restaurants.update', $restaurant) }}">
        @csrf
        @method('PUT')
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Name</label>
                <input type="text" name="name" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('name', $restaurant->name) }}" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input type="text" name="phone" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('phone', $restaurant->phone) }}">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                    <input type="text" name="currency" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('currency', $restaurant->currency) }}">
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                <input type="text" name="address" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('address', $restaurant->address) }}">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">VAT (%)</label>
                    <input type="number" step="0.01" name="vat_percent" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('vat_percent', $restaurant->vat_percent) }}">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Link</label>
                    <input type="text" name="restaurant_link" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('restaurant_link', $restaurant->restaurant_link) }}">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Subscription Status</label>
                    <select name="subscription_status" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                        <option value="active" {{ old('subscription_status', $restaurant->subscription_status) === 'active' ? 'selected' : '' }}>Active</option>
                        <option value="suspended" {{ old('subscription_status', $restaurant->subscription_status) === 'suspended' ? 'selected' : '' }}>Suspended</option>
                        <option value="pending" {{ old('subscription_status', $restaurant->subscription_status) === 'pending' ? 'selected' : '' }}>Pending</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">KYC Status</label>
                    <select name="kyc_status" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                        <option value="pending" {{ old('kyc_status', $restaurant->kyc_status) === 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="approved" {{ old('kyc_status', $restaurant->kyc_status) === 'approved' ? 'selected' : '' }}>Approved</option>
                        <option value="rejected" {{ old('kyc_status', $restaurant->kyc_status) === 'rejected' ? 'selected' : '' }}>Rejected</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-2 pt-2">
                <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Save Changes</button>
                <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Cancel</a>
            </div>
        </div>
    </form>
</div>
@endsection
