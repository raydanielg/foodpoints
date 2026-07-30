<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>{{ $restaurant->name }} — Order</title>
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
        * { -webkit-tap-highlight-color: transparent; }
        body { overscroll-behavior: none; }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity:0 } to { transform: scale(1); opacity:1 } }
        .sheet { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in { animation: fadeIn 0.2s ease-out both; }
        .scale-in { animation: scaleIn 0.2s ease-out both; }
        .nav-btn { transition: all 0.2s ease; }
        .nav-btn:active { transform: scale(0.92); }
        .menu-row { transition: all 0.15s ease; }
        .menu-row:active { transform: scale(0.98); background: #f0fdf4; }
        .qty-btn { transition: all 0.15s ease; }
        .qty-btn:active { transform: scale(0.85); }
        .pill { transition: all 0.2s ease; white-space: nowrap; }
        .pill.active { background: #024938; color: #fff; border-color: #024938; }
        .scrollx { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .scrollx::-webkit-scrollbar { display: none; }
        .page { display: none; }
        .page.active { display: block; }
        .badge-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        .img-modal { animation: scaleIn 0.25s ease-out both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #024938; border-radius: 2px; }
    </style>
</head>
<body class="font-['Nunito',sans-serif] antialiased bg-gray-100">

    {{-- App Container --}}
    <div class="max-w-md mx-auto bg-gray-50 min-h-screen relative pb-20 shadow-xl">

        {{-- ===== HEADER: Cover Card ===== --}}
        <header class="relative overflow-hidden rounded-b-3xl shadow-lg">
            @if ($restaurant->cover_url)
            <img src="{{ $restaurant->cover_url }}" alt="" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>
            @else
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900"></div>
            <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%221%22%3E%3Cpath d=%22M20 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10c0 5.5-4.5 10-10 10S0 25.5 0 20 4.5 10 10 10s10 4.5 10 10z%22/%3E%3C/g%3E%3C/svg%3E');"></div>
            @endif

            <div class="relative px-5 pt-6 pb-5">
                <div class="flex items-center gap-3">
                    <div class="relative flex-shrink-0">
                        @if ($restaurant->logo_url)
                        <img src="{{ $restaurant->logo_url }}" alt="" class="w-14 h-14 rounded-full object-cover ring-4 ring-white/30 shadow-lg">
                        @else
                        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                            <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                        </div>
                        @endif
                    </div>
                    <div class="flex-1 min-w-0 text-white">
                        <h1 class="text-lg font-extrabold truncate leading-tight">{{ $restaurant->name }}</h1>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold text-white">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                Table {{ $table->table_number }}
                            </span>
                            <span class="text-[10px] text-white/60">Session #{{ $session->id }}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex items-center gap-2">
                    <div class="flex-1 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
                        <p class="text-[9px] text-white/60 font-medium uppercase tracking-wide">Bill</p>
                        <p class="text-sm font-extrabold text-white" id="headerBill">{{ number_format($session->total_amount, 0) }} {{ $restaurant->currency }}</p>
                    </div>
                    <div class="flex-1 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
                        <p class="text-[9px] text-white/60 font-medium uppercase tracking-wide">Paid</p>
                        <p class="text-sm font-extrabold text-gold-300" id="headerPaid">{{ number_format($session->paid_amount, 0) }} {{ $restaurant->currency }}</p>
                    </div>
                    <div class="flex-1 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
                        <p class="text-[9px] text-white/60 font-medium uppercase tracking-wide">Orders</p>
                        <p class="text-sm font-extrabold text-white" id="headerOrders">{{ $session->orders->count() }}</p>
                    </div>
                </div>
            </div>
        </header>

        {{-- ===== PAGE: MENU ===== --}}
        <div id="page-menu" class="page active">
            @if ($categories->count() > 0)
            <div class="sticky top-0 z-20 bg-gray-50/95 backdrop-blur px-4 py-3 border-b border-gray-100">
                <div class="flex gap-2 scrollx overflow-x-auto" id="categoryPills">
                    <button onclick="filterCategory('all', this)" class="pill active px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-600">All</button>
                    @foreach ($categories as $category)
                    <button onclick="filterCategory('cat-{{ $category->id }}', this)" class="pill px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-600">{{ $category->name }}</button>
                    @endforeach
                </div>
            </div>
            @endif
            <div class="px-4 py-3 space-y-2">
                @if ($categories->count() > 0)
                    @foreach ($categories as $category)
                    <div id="cat-{{ $category->id }}" class="cat-section">
                        <h2 class="text-sm font-extrabold text-gray-900 mt-4 mb-2 flex items-center gap-2">
                            <span class="w-1 h-5 bg-gold-400 rounded-full"></span>
                            {{ $category->name }}
                            <span class="text-[10px] font-medium text-gray-400">({{ $category->items->count() }})</span>
                        </h2>
                        <div class="space-y-2">
                            @foreach ($category->items as $item)
                            <div class="menu-row bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3" onclick="addToCart({{ $item->id }}, '{{ addslashes($item->name) }}', {{ $item->price }}, '{{ $restaurant->currency }}', {{ $item->prep_time_min ?? 0 }})">
                                <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-sm font-bold text-gray-900 truncate">{{ $item->name }}</h3>
                                    @if ($item->description)
                                    <p class="text-[11px] text-gray-400 truncate">{{ $item->description }}</p>
                                    @endif
                                    <div class="flex items-center gap-3 mt-1">
                                        <span class="text-sm font-extrabold text-emerald-600">{{ number_format($item->price, 0) }} {{ $restaurant->currency }}</span>
                                        @if ($item->prep_time_min)
                                        <span class="text-[10px] text-gray-400 flex items-center gap-0.5">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            {{ $item->prep_time_min }} min
                                        </span>
                                        @endif
                                        @if ($item->image_url)
                                        <button onclick="event.stopPropagation(); viewImage('{{ $item->image_url }}', '{{ addslashes($item->name) }}')" class="text-[10px] text-sky-500 font-semibold flex items-center gap-0.5 ml-auto">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                            Photo
                                        </button>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>
                    @endforeach
                @else
                <div class="text-center py-16">
                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 class="text-sm font-bold text-gray-700">No Menu Available</h3>
                    <p class="text-xs text-gray-400 mt-1">The restaurant hasn't added menu items yet.</p>
                </div>
                @endif
            </div>
        </div>

        {{-- ===== PAGE: ORDERS ===== --}}
        <div id="page-orders" class="page">
            <div class="px-4 py-4">
                <h2 class="text-lg font-extrabold text-gray-900 mb-1">Your Orders</h2>
                <p class="text-xs text-gray-400 mb-4">Track your orders in real-time</p>
                <div id="ordersList" class="space-y-3"></div>
            </div>
        </div>

        {{-- ===== PAGE: BILL ===== --}}
        <div id="page-bill" class="page">
            <div class="px-4 py-4">
                <h2 class="text-lg font-extrabold text-gray-900 mb-1">Bill &amp; Payment</h2>
                <p class="text-xs text-gray-400 mb-4">View your bill and pay securely</p>
                <div id="billContent"></div>
            </div>
        </div>

        {{-- ===== BOTTOM NAV ===== --}}
        <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div class="flex items-center justify-around py-2 px-2">
                <button onclick="showPage('menu')" class="nav-btn flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" id="nav-menu">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h18M3 12h18M3 19h18"/></svg>
                    <span class="text-[10px] font-bold text-emerald-600">Menu</span>
                </button>
                <button onclick="showPage('orders')" class="nav-btn flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl relative" id="nav-orders">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    <span class="text-[10px] font-bold text-gray-400">Orders</span>
                    <span id="ordersBadge" class="hidden absolute top-0 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center">0</span>
                </button>
                <button onclick="showPage('bill')" class="nav-btn flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl relative" id="nav-bill">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <span class="text-[10px] font-bold text-gray-400">Bill</span>
                    <span id="billBadge" class="hidden absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-500 badge-pulse"></span>
                </button>
            </div>
            <div id="cartBar" class="hidden border-t border-gray-100 px-3 py-2">
                <button onclick="openCart()" class="w-full flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl px-4 py-2.5 font-bold text-sm">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        <span id="cartCount">0 items</span>
                    </span>
                    <span id="cartTotal">0 →</span>
                </button>
            </div>
        </nav>

        {{-- ===== CART SHEET ===== --}}
        <div id="cartOverlay" class="fixed inset-0 bg-black/50 z-50 hidden" onclick="closeCart()"></div>
        <div id="cartSheet" class="sheet fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl z-50 hidden flex flex-col" style="max-height: 80vh;">
            <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <h3 class="text-base font-extrabold text-gray-900">Your Cart</h3>
                <button onclick="closeCart()" class="p-1.5 rounded-lg hover:bg-gray-100">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div id="cartItems" class="flex-1 overflow-y-auto px-5 py-3 space-y-3"></div>
            <div class="border-t border-gray-100 px-5 py-3 space-y-2">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Subtotal</span>
                    <span id="cartSubtotal" class="font-bold text-gray-900">0</span>
                </div>
                @if ($restaurant->vat_percent > 0)
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">VAT ({{ $restaurant->vat_percent }}%)</span>
                    <span id="cartVat" class="font-bold text-gray-900">0</span>
                </div>
                @endif
                <div class="flex items-center justify-between text-base border-t border-gray-100 pt-2">
                    <span class="font-extrabold text-gray-900">Total</span>
                    <span id="cartGrandTotal" class="font-extrabold text-emerald-600">0</span>
                </div>
                <button id="placeOrderBtn" onclick="placeOrder()" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-transform disabled:opacity-50">Place Order</button>
            </div>
        </div>

        {{-- ===== IMAGE MODAL ===== --}}
        <div id="imgOverlay" class="fixed inset-0 bg-black/80 z-[60] hidden flex items-center justify-center p-6" onclick="closeImage()">
            <div class="img-modal w-full max-w-sm">
                <img id="imgModalSrc" src="" alt="" class="w-full rounded-2xl shadow-2xl">
                <p id="imgModalCaption" class="text-white text-sm font-bold text-center mt-3"></p>
            </div>
        </div>

        {{-- ===== TOAST ===== --}}
        <div id="toast" class="fixed top-20 left-1/2 -translate-x-1/2 z-[70] hidden">
            <div id="toastInner" class="bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span id="toastMsg">Added</span>
            </div>
        </div>

        {{-- ===== NOTIFICATION PERMISSION MODAL ===== --}}
        <div id="notifOverlay" class="fixed inset-0 bg-black/60 z-[65] hidden flex items-center justify-center p-6">
            <div class="scale-in bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <h3 class="text-lg font-extrabold text-gray-900">Enable Notifications</h3>
                <p class="text-sm text-gray-500 mt-2 mb-5">Get notified when your order status changes — from kitchen to your table. Never miss an update!</p>
                <div class="space-y-2">
                    <button onclick="requestNotifications()" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-transform">
                        Allow Notifications
                    </button>
                    <button onclick="dismissNotifications()" class="w-full py-2.5 text-gray-500 font-semibold text-xs hover:text-gray-700 transition-colors">
                        Maybe later
                    </button>
                </div>
            </div>
        </div>

        {{-- ===== USSD WAITING MODAL ===== --}}
        <div id="ussdOverlay" class="fixed inset-0 bg-black/60 z-[65] hidden flex items-center justify-center p-6">
            <div class="scale-in bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg class="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <h3 class="text-lg font-extrabold text-gray-900">Waiting for Authorization</h3>
                <p id="ussdMsg" class="text-sm text-gray-500 mt-2 mb-5">Check your phone for the USSD prompt and enter your PIN to authorize the payment.</p>
                <input type="hidden" id="ussdPaymentId" value="">
                <div class="space-y-2">
                    <button onclick="retryUssd()" class="w-full py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Resend USSD Push
                    </button>
                    <button onclick="cancelUssdWait()" class="w-full py-2 text-gray-400 font-semibold text-xs hover:text-gray-600 transition-colors">
                        Cancel
                    </button>
                </div>
                <p class="text-[10px] text-gray-300 mt-3">Payment expires in 4 hours if not completed</p>
            </div>
        </div>
    </div>

    <script>
        const SESSION_ID = {{ $session->id }};
        const CURRENCY = '{{ $restaurant->currency }}';
        const VAT_PERCENT = {{ $restaurant->vat_percent }};
        const CSRF_TOKEN = '{{ csrf_token() }}';
        let cart = [];
        let sessionData = @json($session->load(['orders.items.menuItem', 'payments']));

        function showPage(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + page).classList.add('active');
            ['menu','orders','bill'].forEach(p => {
                const nav = document.getElementById('nav-' + p);
                const svg = nav.querySelector('svg');
                const span = nav.querySelector('span');
                if (p === page) { svg.classList.remove('text-gray-400'); svg.classList.add('text-emerald-600'); span.classList.remove('text-gray-400'); span.classList.add('text-emerald-600'); }
                else { svg.classList.add('text-gray-400'); svg.classList.remove('text-emerald-600'); span.classList.add('text-gray-400'); span.classList.remove('text-emerald-600'); }
            });
            if (page === 'orders') renderOrders();
            if (page === 'bill') renderBill();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function filterCategory(id, btn) {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            if (id === 'all') { document.querySelectorAll('.cat-section').forEach(s => s.style.display = 'block'); }
            else { document.querySelectorAll('.cat-section').forEach(s => s.style.display = 'none'); const el = document.getElementById(id); if (el) el.style.display = 'block'; }
        }

        function viewImage(url, name) { document.getElementById('imgModalSrc').src = url; document.getElementById('imgModalCaption').textContent = name; document.getElementById('imgOverlay').classList.remove('hidden'); }
        function closeImage() { document.getElementById('imgOverlay').classList.add('hidden'); }

        function addToCart(id, name, price, currency, prepTime) {
            const existing = cart.find(i => i.menu_item_id === id);
            if (existing) { existing.quantity++; } else { cart.push({ menu_item_id: id, name, price, quantity: 1, currency, prep_time: prepTime }); }
            updateCartUI(); showToast('Added to cart');
        }
        function removeFromCart(id) { cart = cart.filter(i => i.menu_item_id !== id); updateCartUI(); }
        function changeQty(id, delta) { const item = cart.find(i => i.menu_item_id === id); if (!item) return; item.quantity += delta; if (item.quantity <= 0) removeFromCart(id); updateCartUI(); }

        function updateCartUI() {
            const count = cart.reduce((s,i) => s + i.quantity, 0);
            const subtotal = cart.reduce((s,i) => s + (i.price * i.quantity), 0);
            const vat = subtotal * (VAT_PERCENT / 100);
            const total = subtotal + vat;
            const cartBar = document.getElementById('cartBar');
            if (count > 0) { cartBar.classList.remove('hidden'); document.getElementById('cartCount').textContent = count + (count === 1 ? ' item' : ' items'); document.getElementById('cartTotal').innerHTML = formatMoney(total) + ' ' + CURRENCY + ' &rarr;'; }
            else { cartBar.classList.add('hidden'); }
            const container = document.getElementById('cartItems');
            if (cart.length === 0) { container.innerHTML = '<div class="text-center py-12 text-gray-400 text-sm">Cart is empty</div>'; }
            else { container.innerHTML = cart.map(item => `<div class="flex items-center gap-3 fade-in"><div class="flex-1 min-w-0"><p class="text-sm font-bold text-gray-900 truncate">${item.name}</p><p class="text-xs text-emerald-600 font-bold">${formatMoney(item.price * item.quantity)} ${CURRENCY}</p></div><div class="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1"><button class="qty-btn w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold text-lg" onclick="changeQty(${item.menu_item_id}, -1)">−</button><span class="text-sm font-bold w-6 text-center">${item.quantity}</span><button class="qty-btn w-7 h-7 rounded-lg bg-emerald-600 text-white shadow-sm flex items-center justify-center font-bold" onclick="changeQty(${item.menu_item_id}, 1)">+</button></div></div>`).join(''); }
            document.getElementById('cartSubtotal').textContent = formatMoney(subtotal) + ' ' + CURRENCY;
            document.getElementById('cartVat').textContent = formatMoney(vat) + ' ' + CURRENCY;
            document.getElementById('cartGrandTotal').textContent = formatMoney(total) + ' ' + CURRENCY;
            document.getElementById('placeOrderBtn').disabled = cart.length === 0;
        }
        function openCart() { document.getElementById('cartOverlay').classList.remove('hidden'); document.getElementById('cartSheet').classList.remove('hidden'); updateCartUI(); }
        function closeCart() { document.getElementById('cartOverlay').classList.add('hidden'); document.getElementById('cartSheet').classList.add('hidden'); }

        async function placeOrder() {
            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = true; btn.textContent = 'Placing Order...';
            try {
                const res = await fetch('{{ route("public.order") }}', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN, 'Accept': 'application/json' }, body: JSON.stringify({ session_id: SESSION_ID, items: cart.map(i => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })) }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed');
                sessionData = data.session; cart = []; updateCartUI(); closeCart(); showToast('Order placed!'); updateHeader(); renderOrders();
            } catch (err) { showToast(err.message, true); btn.disabled = false; btn.textContent = 'Place Order'; }
        }

        function renderOrders() {
            const container = document.getElementById('ordersList');
            const orders = sessionData.orders || [];
            if (orders.length === 0) { container.innerHTML = `<div class="text-center py-16"><div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div><h3 class="text-sm font-bold text-gray-700">No Orders Yet</h3><p class="text-xs text-gray-400 mt-1">Browse the menu and place your first order</p></div>`; return; }
            const sc = { received: { c: 'bg-sky-50 text-sky-700 border-sky-100', i: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', l: 'Received' }, preparing: { c: 'bg-amber-50 text-amber-700 border-amber-100', i: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', l: 'Preparing' }, ready: { c: 'bg-violet-50 text-violet-700 border-violet-100', i: 'M5 13l4 4L19 7', l: 'Ready' }, served: { c: 'bg-emerald-50 text-emerald-700 border-emerald-100', i: 'M5 13l4 4L19 7', l: 'Served' } };
            container.innerHTML = orders.map(order => { const cfg = sc[order.status] || sc.received; return `<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden fade-in"><div class="px-4 py-3 border-b border-gray-50 flex items-center justify-between"><div><span class="text-sm font-extrabold text-gray-900">Order #${order.id}</span><p class="text-[10px] text-gray-400">${new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p></div><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.c}"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="${cfg.i}"/></svg>${cfg.l}</span></div><div class="px-4 py-3 space-y-2">${order.items.map(item => `<div class="flex items-start justify-between text-sm"><div class="flex items-start gap-2 flex-1 min-w-0"><span class="font-bold text-emerald-600 flex-shrink-0">${item.quantity}×</span><div class="min-w-0"><p class="font-semibold text-gray-800 truncate">${item.menu_item.name}</p>${item.notes ? `<p class="text-[11px] text-gray-400 italic">"${item.notes}"</p>` : ''}</div></div><span class="font-bold text-gray-700 flex-shrink-0">${formatMoney(parseFloat(item.unit_price) * item.quantity)} ${CURRENCY}</span></div>`).join('')}</div></div>`; }).join('');
        }

        function renderBill() {
            const container = document.getElementById('billContent');
            const orders = sessionData.orders || [];
            const payments = sessionData.payments || [];
            const totalAmount = parseFloat(sessionData.total_amount) || 0;
            const paidAmount = parseFloat(sessionData.paid_amount) || 0;
            const remaining = totalAmount - paidAmount;
            let html = `<div class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"><div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div><div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div><div class="relative z-10"><p class="text-xs text-emerald-100 font-medium uppercase tracking-wide">Total Bill</p><p class="text-3xl font-extrabold mt-1">${formatMoney(totalAmount)} ${CURRENCY}</p><div class="grid grid-cols-2 gap-3 mt-4"><div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2"><p class="text-[10px] text-emerald-100">Paid</p><p class="text-base font-bold text-gold-300">${formatMoney(paidAmount)} ${CURRENCY}</p></div><div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2"><p class="text-[10px] text-emerald-100">Remaining</p><p class="text-base font-bold text-white">${formatMoney(remaining)} ${CURRENCY}</p></div></div></div></div>`;
            if (orders.length > 0) {
                html += `<h3 class="text-sm font-extrabold text-gray-900 mt-5 mb-2">Order Breakdown</h3><div class="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">`;
                orders.forEach(order => { order.items.forEach(item => { html += `<div class="px-4 py-2.5 flex items-center justify-between text-sm"><div class="flex items-center gap-2 flex-1 min-w-0"><span class="font-bold text-emerald-600 flex-shrink-0">${item.quantity}×</span><span class="text-gray-700 truncate">${item.menu_item.name}</span></div><span class="font-bold text-gray-700 flex-shrink-0">${formatMoney(parseFloat(item.unit_price) * item.quantity)} ${CURRENCY}</span></div>`; }); });
                html += `</div>`;
            }
            if (remaining > 0.01 && sessionData.status === 'open') {
                html += `<h3 class="text-sm font-extrabold text-gray-900 mt-5 mb-2">Pay Now</h3><div class="bg-white rounded-2xl border border-gray-100 p-4 space-y-3"><div><label class="block text-xs font-bold text-gray-600 mb-1.5">Payment Method</label><div class="grid grid-cols-2 gap-2"><button onclick="selectMethod('mobile_money', this)" class="pay-method-btn flex flex-col items-center gap-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 active:scale-95 transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>Mobile Money</button><button onclick="selectMethod('cash', this)" class="pay-method-btn flex flex-col items-center gap-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 active:scale-95 transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Cash</button></div></div><div id="phoneInputWrap" class="hidden"><label class="block text-xs font-bold text-gray-600 mb-1.5">Phone Number (Mobile Money)</label><input type="tel" id="payerPhone" placeholder="0712 345 678 or 255712 345 678" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"></div><div><label class="block text-xs font-bold text-gray-600 mb-1.5">Amount</label><div class="flex gap-2"><input type="number" id="payAmount" value="${remaining.toFixed(2)}" step="0.01" min="0" class="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"><button onclick="setFullAmount(${remaining.toFixed(2)})" class="px-3 py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 active:scale-95 transition-all">Full</button></div></div><div><label class="block text-xs font-bold text-gray-600 mb-1.5">Your Name (optional)</label><input type="text" id="payerLabel" placeholder="e.g. John" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"></div><button onclick="processPayment()" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-transform">Pay ${formatMoney(remaining)} ${CURRENCY}</button></div>`;
            } else if (remaining <= 0.01) {
                html += `<div class="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"><div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg></div><p class="text-sm font-extrabold text-emerald-700">Bill Fully Paid!</p><p class="text-xs text-emerald-600 mt-1">Thank you for dining with us</p></div>`;
            }
            if (payments.length > 0) {
                html += `<h3 class="text-sm font-extrabold text-gray-900 mt-5 mb-2">Payment History</h3><div class="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">`;
                payments.forEach(p => { html += `<div class="px-4 py-2.5 flex items-center justify-between text-sm"><div class="flex items-center gap-2"><span class="font-semibold text-gray-700 capitalize">${p.method.replace('_', ' ')}</span>${p.payer_label ? `<span class="text-gray-400 text-xs">— ${p.payer_label}</span>` : ''}</div><div class="flex items-center gap-2"><span class="font-bold text-gray-700">${formatMoney(parseFloat(p.amount))} ${CURRENCY}</span><span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">${p.status}</span></div></div>`; });
                html += `</div>`;
            }
            container.innerHTML = html;
        }

        let selectedMethod = null;
        function selectMethod(method, btn) {
            selectedMethod = method;
            document.querySelectorAll('.pay-method-btn').forEach(b => { b.classList.remove('border-emerald-400','bg-emerald-50','text-emerald-700'); b.classList.add('border-gray-200','text-gray-600'); });
            btn.classList.remove('border-gray-200','text-gray-600'); btn.classList.add('border-emerald-400','bg-emerald-50','text-emerald-700');
            const phoneWrap = document.getElementById('phoneInputWrap');
            if (phoneWrap) { if (method === 'mobile_money') phoneWrap.classList.remove('hidden'); else phoneWrap.classList.add('hidden'); }
        }

        let paymentPollTimer = null;
        async function processPayment() {
            if (!selectedMethod) { showToast('Select payment method', true); return; }
            const amount = parseFloat(document.getElementById('payAmount').value);
            const payerLabel = document.getElementById('payerLabel')?.value || '';
            if (!amount || amount <= 0) { showToast('Enter valid amount', true); return; }

            const body = { session_id: SESSION_ID, amount, method: selectedMethod, split_type: 'full', payer_label: payerLabel || null };
            if (selectedMethod === 'mobile_money') {
                const phone = document.getElementById('payerPhone')?.value?.trim();
                if (!phone) { showToast('Enter your phone number', true); return; }
                body.payer_phone = phone;
            }

            try {
                const res = await fetch('{{ route("public.payment") }}', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN, 'Accept': 'application/json' }, body: JSON.stringify(body) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Payment failed');

                if (selectedMethod === 'mobile_money' && data.snippe_reference) {
                    sessionData = data.session;
                    updateHeader();
                    showUssdWaitingModal(data.payment.id, data.message || 'Check your phone for USSD push');
                } else {
                    sessionData = data.session;
                    showToast(selectedMethod === 'cash' ? 'Cash payment recorded. Waiter will confirm.' : 'Payment successful!');
                    updateHeader();
                    renderBill();
                }
            } catch (err) { showToast(err.message, true); }
        }

        function showUssdWaitingModal(paymentId, msg) {
            const overlay = document.getElementById('ussdOverlay');
            document.getElementById('ussdMsg').textContent = msg;
            document.getElementById('ussdPaymentId').value = paymentId;
            overlay.classList.remove('hidden');
            startPaymentPolling(paymentId);
        }

        function startPaymentPolling(paymentId) {
            if (paymentPollTimer) clearInterval(paymentPollTimer);
            let attempts = 0;
            paymentPollTimer = setInterval(async () => {
                attempts++;
                if (attempts > 120) { clearInterval(paymentPollTimer); return; }
                try {
                    const res = await fetch('/public/payment/' + paymentId + '/status', { headers: { 'Accept': 'application/json' } });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.payment_status === 'completed') {
                            clearInterval(paymentPollTimer);
                            sessionData = data.session;
                            document.getElementById('ussdOverlay').classList.add('hidden');
                            showToast('Payment successful!');
                            updateHeader();
                            renderBill();
                        } else if (data.payment_status === 'failed') {
                            clearInterval(paymentPollTimer);
                            document.getElementById('ussdOverlay').classList.add('hidden');
                            showToast('Payment failed. Please try again.', true);
                            renderBill();
                        }
                    }
                } catch (e) {}
            }, 5000);
        }

        async function retryUssd() {
            const paymentId = document.getElementById('ussdPaymentId').value;
            try {
                const res = await fetch('/public/payment/' + paymentId + '/retry-ussd', { method: 'POST', headers: { 'X-CSRF-TOKEN': CSRF_TOKEN, 'Accept': 'application/json' } });
                const data = await res.json();
                showToast(data.message || 'USSD push sent');
            } catch (e) { showToast('Failed to retry', true); }
        }

        function cancelUssdWait() {
            if (paymentPollTimer) clearInterval(paymentPollTimer);
            document.getElementById('ussdOverlay').classList.add('hidden');
            renderBill();
        }

        function updateHeader() {
            const total = parseFloat(sessionData.total_amount) || 0;
            const paid = parseFloat(sessionData.paid_amount) || 0;
            document.getElementById('headerBill').textContent = formatMoney(total) + ' ' + CURRENCY;
            document.getElementById('headerPaid').textContent = formatMoney(paid) + ' ' + CURRENCY;
            document.getElementById('headerOrders').textContent = (sessionData.orders || []).length;
            const ordersBadge = document.getElementById('ordersBadge');
            const count = (sessionData.orders || []).length;
            if (count > 0) { ordersBadge.classList.remove('hidden'); ordersBadge.textContent = count; } else { ordersBadge.classList.add('hidden'); }
            const billBadge = document.getElementById('billBadge');
            if (total - paid > 0.01 && sessionData.status === 'open') billBadge.classList.remove('hidden'); else billBadge.classList.add('hidden');
        }

        function formatMoney(n) { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n); }

        function showToast(msg, isError = false) {
            const toast = document.getElementById('toast');
            const inner = document.getElementById('toastInner');
            document.getElementById('toastMsg').textContent = msg;
            if (isError) { inner.classList.remove('bg-emerald-600'); inner.classList.add('bg-red-600'); } else { inner.classList.remove('bg-red-600'); inner.classList.add('bg-emerald-600'); }
            toast.classList.remove('hidden');
            clearTimeout(window._toastTimer);
            window._toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
        }

        setInterval(async () => {
            try {
                const res = await fetch('/public/session/' + SESSION_ID, { headers: { 'Accept': 'application/json' } });
                if (res.ok) {
                    const data = await res.json();
                    const prevOrders = (sessionData.orders || []).map(o => o.id + ':' + o.status).join(',');
                    sessionData = data.session;
                    updateHeader();
                    if (document.getElementById('page-orders').classList.contains('active')) renderOrders();
                    if (document.getElementById('page-bill').classList.contains('active')) renderBill();
                    checkOrderStatusChanges(prevOrders);
                }
            } catch (e) {}
        }, 15000);

        function checkOrderStatusChanges(prevStatuses) {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            const orders = sessionData.orders || [];
            const statusLabels = { received: 'Order Received', preparing: 'Your order is being prepared', ready: 'Your order is ready!', served: 'Your order has been served' };
            orders.forEach(order => {
                const key = order.id + ':' + order.status;
                if (!prevStatuses.includes(key) && statusLabels[order.status]) {
                    const prevKey = order.id + ':';
                    const wasInPrev = prevStatuses.includes(order.id + ':received') || prevStatuses.includes(order.id + ':preparing') || prevStatuses.includes(order.id + ':ready');
                    if (wasInPrev) {
                        new Notification('{{ addslashes($restaurant->name) }}', { body: statusLabels[order.status] + ' — Order #' + order.id, icon: '{{ $restaurant->logo_url ?? "" }}' });
                    }
                }
            });
        }

        function requestNotifications() {
            if (!('Notification' in window)) { dismissNotifications(); showToast('Notifications not supported'); return; }
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showToast('Notifications enabled!');
                    new Notification('{{ addslashes($restaurant->name) }}', { body: 'You will now receive updates about your orders.', icon: '{{ $restaurant->logo_url ?? "" }}' });
                }
                dismissNotifications();
            });
        }
        function dismissNotifications() { document.getElementById('notifOverlay').classList.add('hidden'); }

        if (!localStorage.getItem('notifAsked')) {
            setTimeout(() => {
                document.getElementById('notifOverlay').classList.remove('hidden');
                localStorage.setItem('notifAsked', '1');
            }, 2000);
        }

        updateCartUI(); updateHeader();
    </script>
</body>
</html>
