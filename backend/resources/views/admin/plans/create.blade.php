@extends('admin.layout')

@section('title', 'Create Plan — FoodPoint Admin')
@section('page_title', 'Create Plan')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">Create Plan</h2>
        <p class="text-sm text-gray-400">Add a new subscription plan</p>
    </div>
    <a href="{{ route('admin.plans.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Back</a>
</div>

<div class="bg-white rounded-xl border p-6 max-w-2xl">
    <form method="POST" action="{{ route('admin.plans.store') }}">
        @csrf
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Plan Name</label>
                <input type="text" name="name" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('name') }}" placeholder="e.g. Basic, Pro, Enterprise" required>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea name="description" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all min-h-[80px] resize-vertical" placeholder="Short description of the plan">{{ old('description') }}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                    <input type="number" step="0.01" name="price" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('price', '0') }}" required>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                    <input type="text" name="currency" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('currency', 'TZS') }}" required>
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Duration (days)</label>
                <input type="number" name="duration_days" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('duration_days', '30') }}" required>
                <p class="text-xs text-gray-400 mt-1">How many days the subscription lasts after payment</p>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Features (one per line)</label>
                <textarea name="features" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all min-h-[100px] resize-vertical" placeholder="QR code ordering&#10;Split payments&#10;Kitchen display&#10;Up to 50 menu items">{{ old('features') }}</textarea>
                <p class="text-xs text-gray-400 mt-1">Each line will be shown as a feature with a checkmark</p>
            </div>
            <div>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_active" checked class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    <span class="text-sm font-semibold text-gray-700">Active (restaurants can subscribe to this plan)</span>
                </label>
            </div>
            <div class="flex gap-2 pt-2">
                <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Create Plan</button>
                <a href="{{ route('admin.plans.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Cancel</a>
            </div>
        </div>
    </form>
</div>
@endsection
