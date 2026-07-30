@extends('admin.layout')

@section('title', 'Snippe Settings — Admin')
@section('page_title', 'Snippe Payment Gateway')

@section('content')
<div class="max-w-2xl space-y-6">

    {{-- Status Card --}}
    <div class="rounded-2xl border p-5 {{ $config['configured'] ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50' }}">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center {{ $config['configured'] ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600' }}">
                @if ($config['configured'])
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                @else
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                @endif
            </div>
            <div>
                <p class="font-bold text-sm {{ $config['configured'] ? 'text-emerald-800' : 'text-amber-800' }}">
                    {{ $config['configured'] ? 'Snippe is Configured' : 'Snippe is Not Configured' }}
                </p>
                <p class="text-xs {{ $config['configured'] ? 'text-emerald-600' : 'text-amber-600' }} mt-0.5">
                    {{ $config['configured'] ? 'Payments and withdrawals will be processed automatically.' : 'Please enter your Snippe API credentials to enable payments and withdrawals.' }}
                </p>
            </div>
        </div>
    </div>

    {{-- Settings Form --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 class="text-sm font-bold text-gray-700 mb-1">API Configuration</h3>
        <p class="text-xs text-gray-400 mb-5">Configure your Snippe payment gateway credentials. These are stored in your .env file.</p>

        <form action="{{ route('admin.finance.snippe.update') }}" method="POST" class="space-y-5">
            @csrf

            {{-- API Key --}}
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">API Key</label>
                <input
                    type="password"
                    name="snippe_api_key"
                    value=""
                    placeholder="{{ $config['api_key'] ? 'Currently: ' . $config['api_key'] : 'Enter your Snippe API key' }}"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                <p class="text-xs text-gray-400 mt-1">Leave blank to keep the existing key.</p>
            </div>

            {{-- Base URL --}}
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Base URL</label>
                <input
                    type="text"
                    name="snippe_base_url"
                    value="{{ $config['base_url'] }}"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
            </div>

            {{-- API Version --}}
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">API Version</label>
                <input
                    type="text"
                    name="snippe_api_version"
                    value="{{ $config['api_version'] }}"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
            </div>

            {{-- Webhook Secret --}}
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Webhook Secret</label>
                <input
                    type="password"
                    name="snippe_webhook_secret"
                    value=""
                    placeholder="{{ $config['webhook_secret'] ? 'Currently configured (hidden)' : 'Enter your webhook secret' }}"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                <p class="text-xs text-gray-400 mt-1">Used to verify incoming webhook signatures. Leave blank to keep existing.</p>
            </div>

            {{-- Webhook URL Info --}}
            <div class="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p class="text-xs font-semibold text-gray-600 mb-1">Webhook Endpoint URL</p>
                <p class="text-xs text-gray-500 font-mono break-all">{{ url('/webhooks/snippe') }}</p>
                <p class="text-xs text-gray-400 mt-1.5">Configure this URL in your Snippe dashboard to receive payment status notifications.</p>
            </div>

            {{-- Commission Info --}}
            <div class="rounded-xl bg-gold-50 border border-gold-200 p-4">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-gold-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <div>
                        <p class="text-xs font-semibold text-gold-800">Platform Commission Rate</p>
                        <p class="text-xs text-gold-700 mt-0.5">Currently set to <strong>1.5%</strong> per transaction. This is hardcoded in the payment processing logic. To change it, update the <code class="text-xs bg-gold-100 px-1 py-0.5 rounded">COMMISSION_RATE</code> constant in <code class="text-xs bg-gold-100 px-1 py-0.5 rounded">SnippeWebhookController.php</code> and <code class="text-xs bg-gold-100 px-1 py-0.5 rounded">RestaurantController.php</code>.</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save Settings
                </button>
            </div>
        </form>
    </div>

</div>
@endsection
