<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>{{ $restaurant->name }} — FoodPoint</title>
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito:400,500,600,700,800,900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { extend: {
                colors: {
                    emerald: { 50:'#e6f5f1',100:'#b3e0d4',200:'#80cbc0',300:'#4db5a8',400:'#1a9f8e',500:'#024938',600:'#023d30',700:'#013028',800:'#01241f',900:'#001816' },
                    gold: { 50:'#fff5e0',100:'#ffe6b3',200:'#ffd680',300:'#ffc64d',400:'#ffb71a',500:'#f9ac00',600:'#d49700',700:'#b07c00',800:'#8c6100',900:'#684600' }
                }
            }}
        }
    </script>
    <style>
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }
        @keyframes slideDown { from { opacity:0; transform: translateY(-10px) } to { opacity:1; transform: translateY(0) } }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .menu-card { transition: all 0.3s ease; }
        .menu-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.12); }
        .service-card { transition: all 0.3s ease; }
        .service-card:hover { transform: translateY(-6px); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #024938; border-radius: 3px; }
    </style>
</head>
<body class="font-['Nunito',sans-serif] antialiased bg-gray-50">

    {{-- ===== HERO SECTION ===== --}}
    <header class="relative min-h-[480px] flex items-center justify-center overflow-hidden">
        @if ($restaurant->cover_url)
        <img src="{{ $restaurant->cover_url }}" alt="{{ $restaurant->name }}" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        @else
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900"></div>
        <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        @endif

        <div class="relative z-10 text-center px-6 py-16 fade-up max-w-2xl">
            @if ($restaurant->logo_url)
            <img src="{{ $restaurant->logo_url }}" alt="{{ $restaurant->name }}" class="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-2xl ring-4 ring-white/20">
            @else
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-white/20">
                <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            </div>
            @endif
            <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{{ $restaurant->name }}</h1>
            @if ($restaurant->address)
            <p class="text-white/80 text-sm mt-3 flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ $restaurant->address }}
            </p>
            @endif
            @if ($restaurant->phone)
            <p class="text-white/80 text-sm mt-1 flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                {{ $restaurant->phone }}
            </p>
            @endif
        </div>
    </header>

    {{-- ===== ORDER CTA: Table Number Input ===== --}}
    <section class="relative -mt-16 z-20 px-4 fade-up delay-1">
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8">
                <div class="text-center mb-5">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    </div>
                    <h2 class="text-xl font-extrabold text-gray-900">Start Your Order</h2>
                    <p class="text-sm text-gray-500 mt-1">Enter your table number to browse our menu and order directly from your phone</p>
                </div>

                <form id="tableForm" class="space-y-3">
                    @csrf
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1.5">Table Number</label>
                        <div class="flex gap-2">
                            <input type="number" id="tableNumber" name="table_number" min="1" required placeholder="e.g. 5" class="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-bold text-center outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all">
                            <button type="submit" id="tableSubmit" class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2">
                                <span>Start Ordering</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                            </button>
                        </div>
                    </div>
                    <div id="tableError" class="hidden">
                        <p class="text-xs text-red-600 font-semibold flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span id="tableErrorMsg"></span>
                        </p>
                    </div>
                </form>

                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                    <span>Or scan the QR code on your table</span>
                </div>
            </div>
        </div>
    </section>

    {{-- ===== SERVICES SECTION ===== --}}
    <section class="py-16 px-4 fade-up delay-2">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-10">
                <h2 class="text-2xl font-extrabold text-gray-900">Our Services</h2>
                <p class="text-sm text-gray-400 mt-1">Everything you need for a great dining experience</p>
                <div class="w-16 h-1 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full mx-auto mt-3"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="service-card bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900">Digital Menu</h3>
                    <p class="text-xs text-gray-400 mt-1.5">Browse our full menu with prices and preparation times, right from your phone.</p>
                </div>
                <div class="service-card bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900">Instant Ordering</h3>
                    <p class="text-xs text-gray-400 mt-1.5">Place your order in seconds — no waiting for a waiter. Your order goes straight to the kitchen.</p>
                </div>
                <div class="service-card bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                    <div class="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900">Easy Payment</h3>
                    <p class="text-xs text-gray-400 mt-1.5">Pay your bill with mobile money, card, or cash. Split the bill with friends effortlessly.</p>
                </div>
            </div>
        </div>
    </section>

    {{-- ===== HOW IT WORKS ===== --}}
    <section class="py-12 px-4 bg-white fade-up delay-3">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-10">
                <h2 class="text-2xl font-extrabold text-gray-900">How It Works</h2>
                <p class="text-sm text-gray-400 mt-1">Ordering has never been easier</p>
                <div class="w-16 h-1 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full mx-auto mt-3"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg">1</div>
                    <h3 class="text-sm font-bold text-gray-900">Enter Table Number</h3>
                    <p class="text-xs text-gray-400 mt-1">Type your table number above</p>
                </div>
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg">2</div>
                    <h3 class="text-sm font-bold text-gray-900">Browse Menu</h3>
                    <p class="text-xs text-gray-400 mt-1">Explore our delicious offerings</p>
                </div>
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg">3</div>
                    <h3 class="text-sm font-bold text-gray-900">Place Order</h3>
                    <p class="text-xs text-gray-400 mt-1">Add items to cart and order</p>
                </div>
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg">4</div>
                    <h3 class="text-sm font-bold text-gray-900">Pay &amp; Enjoy</h3>
                    <p class="text-xs text-gray-400 mt-1">Pay from your phone when done</p>
                </div>
            </div>
        </div>
    </section>

    {{-- ===== MENU PREVIEW ===== --}}
    @if ($categories->count() > 0)
    <section class="py-16 px-4 fade-up delay-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-10">
                <h2 class="text-2xl font-extrabold text-gray-900">Menu Preview</h2>
                <p class="text-sm text-gray-400 mt-1">A taste of what we offer</p>
                <div class="w-16 h-1 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full mx-auto mt-3"></div>
            </div>

            @foreach ($categories as $category)
            <div class="mb-10">
                <h3 class="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-gold-400 rounded-full"></span>
                    {{ $category->name }}
                    <span class="text-xs font-medium text-gray-400">({{ $category->items->count() }} items)</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach ($category->items as $item)
                    <div class="menu-card bg-white rounded-xl border border-gray-100 overflow-hidden flex">
                        @if ($item->image_url)
                        <img src="{{ $item->image_url }}" alt="{{ $item->name }}" class="w-24 h-24 object-cover flex-shrink-0">
                        @else
                        <div class="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg class="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        @endif
                        <div class="p-3 flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-gray-900 truncate">{{ $item->name }}</h4>
                            @if ($item->description)
                            <p class="text-xs text-gray-400 mt-0.5 line-clamp-2">{{ $item->description }}</p>
                            @endif
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-base font-extrabold text-emerald-600">{{ number_format($item->price, 0) }} {{ $restaurant->currency }}</span>
                                @if ($item->prep_time_min)
                                <span class="text-[10px] text-gray-400 flex items-center gap-0.5">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {{ $item->prep_time_min }} min
                                </span>
                                @endif
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </section>
    @else
    <section class="py-16 px-4 text-center fade-up delay-4">
        <div class="max-w-md mx-auto">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-700">Menu Coming Soon</h3>
            <p class="text-sm text-gray-400 mt-1">We're updating our menu. Please check back later!</p>
        </div>
    </section>
    @endif

    {{-- ===== FOOTER ===== --}}
    <footer class="bg-emerald-900 text-emerald-100 py-10 px-4">
        <div class="max-w-4xl mx-auto text-center">
            <div class="flex items-center justify-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                </div>
                <span class="font-bold text-base">{{ $restaurant->name }}</span>
            </div>
            @if ($restaurant->address)
            <p class="text-xs text-emerald-300/60 mb-1">{{ $restaurant->address }}</p>
            @endif
            @if ($restaurant->phone)
            <p class="text-xs text-emerald-300/60 mb-3">{{ $restaurant->phone }}</p>
            @endif
            <p class="text-xs text-emerald-300/50">Powered by FoodPoint — Smart Restaurant Platform</p>
            <p class="text-xs text-emerald-300/30 mt-2">&copy; {{ date('Y') }} {{ $restaurant->name }}. All rights reserved.</p>
        </div>
    </footer>

    {{-- ===== TOAST ===== --}}
    <div id="toast" class="fixed top-6 left-1/2 -translate-x-1/2 z-[60] hidden">
        <div id="toastInner" class="bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span id="toastMsg"></span>
        </div>
    </div>

    <script>
        const FIND_TABLE_URL = '{{ route("public.findTable", $restaurant->restaurant_link) }}';
        const CSRF_TOKEN = '{{ csrf_token() }}';

        document.getElementById('tableForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('tableNumber');
            const btn = document.getElementById('tableSubmit');
            const errorDiv = document.getElementById('tableError');
            const errorMsg = document.getElementById('tableErrorMsg');
            const tableNum = input.value.trim();

            if (!tableNum || tableNum < 1) {
                errorMsg.textContent = 'Please enter a valid table number.';
                errorDiv.classList.remove('hidden');
                return;
            }

            errorDiv.classList.add('hidden');
            btn.disabled = true;
            btn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span>Finding...</span>';

            try {
                const res = await fetch(FIND_TABLE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN, 'Accept': 'application/json' },
                    body: JSON.stringify({ table_number: parseInt(tableNum) }),
                });

                const data = await res.json();

                if (res.ok) {
                    showToast('Table found! Redirecting...');
                    setTimeout(() => window.location.href = data.redirect, 800);
                } else {
                    errorMsg.textContent = data.message || 'Table not found.';
                    errorDiv.classList.remove('hidden');
                    btn.disabled = false;
                    btn.innerHTML = '<span>Start Ordering</span><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>';
                }
            } catch (err) {
                errorMsg.textContent = 'Something went wrong. Please try again.';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = '<span>Start Ordering</span><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>';
            }
        });

        function showToast(msg) {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').textContent = msg;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2500);
        }
    </script>

</body>
</html>
