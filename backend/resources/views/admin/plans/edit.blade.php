@extends('admin.layout')

@section('title', 'Edit ' . $plan->name . ' — FoodPoint Admin')
@section('page_title', 'Edit Plan')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h2 class="text-xl font-bold text-gray-900">Edit Plan</h2>
        <p class="text-sm text-gray-400">{{ $plan->name }}</p>
    </div>
    <a href="{{ route('admin.plans.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Back</a>
</div>

<div class="bg-white rounded-xl border p-6 max-w-2xl">
    <form id="planEditForm" method="POST" action="{{ route('admin.plans.update', $plan) }}">
        @csrf
        @method('PUT')
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Plan Name</label>
                <input type="text" name="name" id="name" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('name', $plan->name) }}" required>
                <p class="text-xs text-red-500 mt-1 hidden" id="name-error"></p>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea name="description" id="description" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all min-h-[80px] resize-vertical">{{ old('description', $plan->description) }}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                    <input type="number" step="0.01" name="price" id="price" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('price', $plan->price) }}" required>
                    <p class="text-xs text-red-500 mt-1 hidden" id="price-error"></p>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Currency</label>
                    <input type="text" name="currency" id="currency" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('currency', $plan->currency) }}" required>
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Duration (days)</label>
                <input type="number" name="duration_days" id="duration_days" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" value="{{ old('duration_days', $plan->duration_days) }}" required>
                <p class="text-xs text-red-500 mt-1 hidden" id="duration_days-error"></p>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Features (one per line)</label>
                <textarea name="features" id="features" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all min-h-[100px] resize-vertical">{{ old('features', is_array($plan->features) ? implode("\n", $plan->features) : '') }}</textarea>
            </div>
            <div>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_active" id="is_active" {{ old('is_active', $plan->is_active) ? 'checked' : '' }} class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    <span class="text-sm font-semibold text-gray-700">Active</span>
                </label>
            </div>
            <div class="flex gap-2 pt-2">
                <button type="submit" id="submitBtn" class="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span id="btnText">Save Changes</span>
                </button>
                <a href="{{ route('admin.plans.index') }}" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Cancel</a>
            </div>
        </div>
    </form>
</div>

<div id="toastContainer" class="fixed top-20 right-6 z-[60] space-y-2"></div>
@endsection

@push('scripts')
<script>
document.getElementById('planEditForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const formData = new FormData(this);
    formData.append('_method', 'PUT');

    document.querySelectorAll('[id$="-error"]').forEach(el => { el.classList.add('hidden'); el.textContent = ''; });

    btn.disabled = true;
    btnText.textContent = 'Saving...';

    try {
        const res = await fetch('{{ route("admin.plans.update", $plan) }}', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json',
            },
            body: formData,
        });

        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await res.json();
        } else {
            if (res.redirected || res.status === 302) {
                showToast('Session expired. Refreshing page...', 'error');
                setTimeout(() => location.reload(), 1000);
                return;
            }
            data = { message: 'Unexpected response from server.' };
        }

        if (res.ok && data.success) {
            showToast(data.message, 'success');
            setTimeout(() => window.location.href = '{{ route("admin.plans.index") }}', 1000);
        } else if (res.status === 422) {
            if (data.errors) {
                Object.entries(data.errors).forEach(([field, messages]) => {
                    const errEl = document.getElementById(field + '-error');
                    if (errEl) { errEl.textContent = messages[0]; errEl.classList.remove('hidden'); }
                });
            }
            showToast('Please fix the errors below.', 'error');
        } else {
            showToast(data.message || 'Something went wrong.', 'error');
        }
    } catch (err) {
        showToast('Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Save Changes';
    }
});

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
