<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .cart-panel { animation: slideUp 0.3s ease-out both; }
        .fade-in { animation: fadeIn 0.2s ease-out both; }
        .menu-item-card { transition: all 0.2s ease; }
        .menu-item-card:active { transform: scale(0.97); }
        .qty-btn { transition: all 0.15s ease; }
        .qty-btn:active { transform: scale(0.9); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #024938; border-radius: 2px; }
        .category-pill.active { background: #024938; color: white; }
        .toast { animation: fadeIn 0.2s ease-out both, fadeIn 0.2s ease-out 2s reverse both; }
    </style>
</head>
<body class="font-['Nunito',sans-serif] antialiased bg-gray-50 pb-20">

    {{-- Top Bar --}}
    <header class="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white sticky top-0 z-40 shadow-lg">
        <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
                @if ($restaurant->logo_url)
                <img src="{{ $restaurant->logo_url }}" alt="" class="w-9 h-9 rounded-lg object-cover flex-shrink-0">
                @else
                <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                </div>
                @endif
                <div class="min-w-0">
                    <h1 class="text-sm font-bold truncate">{{ $restaurant->name }}</h1>
                    <p class="text-[10px] text-emerald-200/70">Table {{ $table->table_number }}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="text-right">
                    <p class="text-[10px] text-emerald-200/70">Session</p>
                    <p class="text-xs font-semibold">#{{ $session->id }}</p>
                </div>
            </div>
        </div>
    </header>

    {{-- Category Pills --}}
    @if ($categories->count() > 0)
    <div class="sticky top-[52px] z-30 bg-white border-b border-gray-100 px-4 py-2.5 overflow-x-auto">
        <div class="flex gap-2 min-w-max">
            <button onclick="scrollToCategory('all')" class="category-pill active px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 whitespace-nowrap">All</button>
            @foreach ($categories as $category)
            <button onclick="scrollToCategory('cat-{{ $category->id }}')" class="category-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 whitespace-nowrap">{{ $category->name }}</button>
            @endforeach
        </div>
    </div>
    @endif

    {{-- Menu Items --}}
    <main class="px-4 py-4 space-y-6">
        @if ($categories->count() > 0)
            @foreach ($categories as $category)
            <div id="cat-{{ $category->id }}">
                <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span class="w-1 h-5 bg-gold-400 rounded-full"></span>
                    {{ $category->name }}
                </h2>
                <div class="grid grid-cols-1 gap-3">
                    @foreach ($category->items as $item)
                    <div class="menu-item-card bg-white rounded-xl border border-gray-100 p-3 flex gap-3" onclick="addToCart({{ $item->id }}, '{{ addslashes($item->name) }}', {{ $item->price }}, '{{ $restaurant->currency }}')">
                        @if ($item->image_url)
                        <img src="{{ $item->image_url }}" alt="" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                        @else
                        <div class="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        @endif
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 truncate">{{ $item->name }}</h3>
                            @if ($item->description)
                            <p class="text-xs text-gray-400 mt-0.5 line-clamp-2">{{ $item->description }}</p>
                            @endif
                            <div class="flex items-center justify-between mt-1.5">
                                <span class="text-sm font-extrabold text-emerald-600">{{ number_format($item->price, 0) }} {{ $restaurant->currency }}</span>
                                <div class="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                                </div>
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
            <h3 class="text-base font-bold text-gray-700">No Menu Available</h3>
            <p class="text-sm text-gray-400 mt-1">The restaurant hasn't added menu items yet.</p>
        </div>
        @endif
    </main>

    {{-- Cart Bar (floating) --}}
    <div id="cartBar" class="fixed bottom-0 left-0 right-0 z-40 hidden">
        <div class="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
            <button onclick="openCart()" class="w-full flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl px-4 py-3 font-bold text-sm">
                <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <span id="cartCount">0 items</span>
                </span>
                <span id="cartTotal" class="flex items-center gap-1">0 {{ $restaurant->currency }} →</span>
            </button>
        </div>
    </div>

    {{-- Cart Panel (slide up) --}}
    <div id="cartOverlay" class="fixed inset-0 bg-black/50 z-50 hidden" onclick="closeCart()"></div>
    <div id="cartPanel" class="cart-panel fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 class="text-base font-bold text-gray-900">Your Cart</h3>
            <button onclick="closeCart()" class="p-1.5 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div id="cartItems" class="flex-1 overflow-y-auto px-4 py-3 space-y-3"></div>
        <div class="border-t border-gray-100 px-4 py-3 space-y-3">
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span id="cartSubtotal" class="font-bold text-gray-900">0 {{ $restaurant->currency }}</span>
            </div>
            @if ($restaurant->vat_percent > 0)
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">VAT ({{ $restaurant->vat_percent }}%)</span>
                <span id="cartVat" class="font-bold text-gray-900">0 {{ $restaurant->currency }}</span>
            </div>
            @endif
            <div class="flex items-center justify-between text-base border-t border-gray-100 pt-2">
                <span class="font-bold text-gray-900">Total</span>
                <span id="cartGrandTotal" class="font-extrabold text-emerald-600">0 {{ $restaurant->currency }}</span>
            </div>
            <button id="placeOrderBtn" onclick="placeOrder()" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Place Order
            </button>
        </div>
    </div>

    {{-- Orders & Payment Panel --}}
    <div id="ordersOverlay" class="fixed inset-0 bg-black/50 z-50 hidden" onclick="closeOrders()"></div>
    <div id="ordersPanel" class="cart-panel fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 class="text-base font-bold text-gray-900">Your Orders & Payment</h3>
            <button onclick="closeOrders()" class="p-1.5 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4" id="ordersContent"></div>
    </div>

    {{-- Toast --}}
    <div id="toast" class="fixed top-20 left-1/2 -translate-x-1/2 z-[60] hidden">
        <div class="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span id="toastMsg">Added to cart</span>
        </div>
    </div>

    <script>
        const SESSION_ID = {{ $session->id }};
        const CURRENCY = '{{ $restaurant->currency }}';
        const VAT_PERCENT = {{ $restaurant->vat_percent }};
        const CSRF_TOKEN = '{{ csrf_token() }}';

        let cart = [];
        let sessionData = @json($session->load(['orders.items.menuItem', 'payments']));

        // ===== Cart Functions =====
        function addToCart(id, name, price, currency) {
            const existing = cart.find(i => i.menu_item_id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ menu_item_id: id, name, price, quantity: 1, currency });
            }
            updateCartUI();
            showToast('Added to cart');
        }

        function removeFromCart(id) {
            cart = cart.filter(i => i.menu_item_id !== id);
            updateCartUI();
        }

        function changeQty(id, delta) {
            const item = cart.find(i => i.menu_item_id === id);
            if (!item) return;
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
            }
            updateCartUI();
        }

        function updateCartUI() {
            const count = cart.reduce((s, i) => s + i.quantity, 0);
            const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
            const vat = subtotal * (VAT_PERCENT / 100);
            const total = subtotal + vat;

            const cartBar = document.getElementById('cartBar');
            if (count > 0) {
                cartBar.classList.remove('hidden');
                document.getElementById('cartCount').textContent = count + (count === 1 ? ' item' : ' items');
                document.getElementById('cartTotal').innerHTML = formatMoney(total) + ' ' + CURRENCY + ' &rarr;';
            } else {
                cartBar.classList.add('hidden');
            }

            // Cart panel items
            const container = document.getElementById('cartItems');
            if (cart.length === 0) {
                container.innerHTML = '<div class="text-center py-12 text-gray-400 text-sm">Your cart is empty</div>';
            } else {
                container.innerHTML = cart.map(item => `
                    <div class="flex items-center gap-3 fade-in">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900 truncate">${item.name}</p>
                            <p class="text-xs text-emerald-600 font-bold">${formatMoney(item.price * item.quantity)} ${CURRENCY}</p>
                        </div>
                        <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button class="qty-btn w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold" onclick="changeQty(${item.menu_item_id}, -1)">−</button>
                            <span class="text-sm font-bold w-6 text-center">${item.quantity}</span>
                            <button class="qty-btn w-7 h-7 rounded-md bg-emerald-600 text-white shadow-sm flex items-center justify-center font-bold" onclick="changeQty(${item.menu_item_id}, 1)">+</button>
                        </div>
                    </div>
                `).join('');
            }

            document.getElementById('cartSubtotal').textContent = formatMoney(subtotal) + ' ' + CURRENCY;
            document.getElementById('cartVat').textContent = formatMoney(vat) + ' ' + CURRENCY;
            document.getElementById('cartGrandTotal').textContent = formatMoney(total) + ' ' + CURRENCY;

            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = cart.length === 0;
        }

        function openCart() {
            document.getElementById('cartOverlay').classList.remove('hidden');
            document.getElementById('cartPanel').classList.remove('hidden');
            updateCartUI();
        }

        function closeCart() {
            document.getElementById('cartOverlay').classList.add('hidden');
            document.getElementById('cartPanel').classList.add('hidden');
        }

        // ===== Order Functions =====
        async function placeOrder() {
            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = true;
            btn.textContent = 'Placing Order...';

            try {
                const res = await fetch('{{ route("public.order") }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': CSRF_TOKEN,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: SESSION_ID,
                        items: cart.map(i => ({
                            menu_item_id: i.menu_item_id,
                            quantity: i.quantity,
                        })),
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to place order');

                sessionData = data.session;
                cart = [];
                updateCartUI();
                closeCart();
                showToast('Order placed successfully!');
                renderOrders();
                openOrders();
            } catch (err) {
                showToast(err.message, true);
                btn.disabled = false;
                btn.textContent = 'Place Order';
            }
        }

        function openOrders() {
            document.getElementById('ordersOverlay').classList.remove('hidden');
            document.getElementById('ordersPanel').classList.remove('hidden');
            renderOrders();
        }

        function closeOrders() {
            document.getElementById('ordersOverlay').classList.add('hidden');
            document.getElementById('ordersPanel').classList.add('hidden');
        }

        function renderOrders() {
            const container = document.getElementById('ordersContent');
            const orders = sessionData.orders || [];
            const payments = sessionData.payments || [];
            const totalAmount = parseFloat(sessionData.total_amount) || 0;
            const paidAmount = parseFloat(sessionData.paid_amount) || 0;
            const remaining = totalAmount - paidAmount;

            let html = '';

            // Bill summary
            html += `
                <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-white">
                    <p class="text-xs text-emerald-100">Total Bill</p>
                    <p class="text-2xl font-extrabold">${formatMoney(totalAmount)} ${CURRENCY}</p>
                    <div class="flex items-center justify-between mt-2 text-xs">
                        <span class="text-emerald-100">Paid: ${formatMoney(paidAmount)} ${CURRENCY}</span>
                        <span class="font-bold text-gold-300">Remaining: ${formatMoney(remaining)} ${CURRENCY}</span>
                    </div>
                </div>
            `;

            // Orders
            if (orders.length === 0) {
                html += '<div class="text-center py-8 text-gray-400 text-sm">No orders yet</div>';
            } else {
                orders.forEach(order => {
                    const statusColors = {
                        received: 'bg-sky-50 text-sky-700 border-sky-100',
                        preparing: 'bg-amber-50 text-amber-700 border-amber-100',
                        ready: 'bg-violet-50 text-violet-700 border-violet-100',
                        served: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    };
                    html += `
                        <div class="bg-white rounded-xl border border-gray-100 p-3">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold text-gray-900">Order #${order.id}</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[order.status] || 'bg-gray-50 text-gray-700 border-gray-100'}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </div>
                            <div class="space-y-1.5">
                                ${order.items.map(item => `
                                    <div class="flex items-center justify-between text-xs">
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold text-gray-700">${item.quantity}×</span>
                                            <span class="text-gray-600">${item.menu_item.name}</span>
                                            ${item.notes ? `<span class="text-gray-400 italic">(${item.notes})</span>` : ''}
                                        </div>
                                        <span class="font-medium text-gray-700">${formatMoney(parseFloat(item.unit_price) * item.quantity)} ${CURRENCY}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
            }

            // Payment section
            if (remaining > 0.01 && sessionData.status === 'open') {
                html += `
                    <div class="bg-white rounded-xl border border-gray-100 p-4">
                        <h4 class="text-sm font-bold text-gray-900 mb-3">Pay Your Bill</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Payment Method</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <button onclick="selectMethod('mobile_money', this)" class="pay-method-btn px-2 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-emerald-400 transition-colors">
                                        <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                        Mobile Money
                                    </button>
                                    <button onclick="selectMethod('card', this)" class="pay-method-btn px-2 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-emerald-400 transition-colors">
                                        <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                        Card
                                    </button>
                                    <button onclick="selectMethod('cash', this)" class="pay-method-btn px-2 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-emerald-400 transition-colors">
                                        <svg class="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                        Cash
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Amount to Pay</label>
                                <div class="flex gap-2">
                                    <input type="number" id="payAmount" value="${remaining.toFixed(2)}" step="0.01" min="0.01" max="${remaining.toFixed(2)}" class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all">
                                    <button onclick="setFullAmount(${remaining.toFixed(2)})" class="px-3 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg">Full</button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Your Name (optional)</label>
                                <input type="text" id="payerLabel" placeholder="e.g. John" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all">
                            </div>
                            <button onclick="processPayment()" class="w-full py-3 bg-gradient-to-r from-gold-300 to-gold-400 text-gray-900 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all">
                                Pay ${formatMoney(remaining)} ${CURRENCY}
                            </button>
                        </div>
                    </div>
                `;
            } else if (remaining <= 0.01) {
                html += `
                    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <svg class="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <p class="text-sm font-bold text-emerald-700">Bill Fully Paid!</p>
                        <p class="text-xs text-emerald-600 mt-1">Thank you for dining with us 🎉</p>
                    </div>
                `;
            }

            // Payment history
            if (payments.length > 0) {
                html += `
                    <div class="bg-white rounded-xl border border-gray-100 p-3">
                        <h4 class="text-xs font-bold text-gray-900 mb-2">Payment History</h4>
                        <div class="space-y-1.5">
                            ${payments.map(p => `
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-700">${p.method.replace('_', ' ')}</span>
                                        ${p.payer_label ? `<span class="text-gray-400">— ${p.payer_label}</span>` : ''}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold text-gray-700">${formatMoney(parseFloat(p.amount))} ${CURRENCY}</span>
                                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">${p.status}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            container.innerHTML = html;
        }

        let selectedMethod = null;
        function selectMethod(method, btn) {
            selectedMethod = method;
            document.querySelectorAll('.pay-method-btn').forEach(b => {
                b.classList.remove('border-emerald-400', 'bg-emerald-50', 'text-emerald-700');
                b.classList.add('border-gray-200', 'text-gray-600');
            });
            btn.classList.remove('border-gray-200', 'text-gray-600');
            btn.classList.add('border-emerald-400', 'bg-emerald-50', 'text-emerald-700');
        }

        function setFullAmount(amount) {
            document.getElementById('payAmount').value = amount.toFixed(2);
        }

        async function processPayment() {
            if (!selectedMethod) {
                showToast('Please select a payment method', true);
                return;
            }

            const amount = parseFloat(document.getElementById('payAmount').value);
            const payerLabel = document.getElementById('payerLabel').value;

            if (!amount || amount <= 0) {
                showToast('Enter a valid amount', true);
                return;
            }

            try {
                const res = await fetch('{{ route("public.payment") }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': CSRF_TOKEN,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: SESSION_ID,
                        amount: amount,
                        method: selectedMethod,
                        split_type: 'full',
                        payer_label: payerLabel || null,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Payment failed');

                sessionData = data.session;
                showToast('Payment successful!');
                renderOrders();

                if (selectedMethod === 'cash') {
                    showToast('Cash payment — waiting for waiter confirmation', true);
                }
            } catch (err) {
                showToast(err.message, true);
            }
        }

        // ===== Utilities =====
        function formatMoney(n) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
        }

        function showToast(msg, isError = false) {
            const toast = document.getElementById('toast');
            const msgEl = document.getElementById('toastMsg');
            msgEl.textContent = msg;
            const inner = toast.firstElementChild;
            if (isError) {
                inner.classList.remove('bg-emerald-600');
                inner.classList.add('bg-red-600');
            } else {
                inner.classList.remove('bg-red-600');
                inner.classList.add('bg-emerald-600');
            }
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2500);
        }

        function scrollToCategory(id) {
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            event.target.classList.add('active');

            if (id === 'all') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const el = document.getElementById(id);
                if (el) {
                    const offset = 100;
                    window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
                }
            }
        }

        // Auto-refresh session data every 15 seconds
        setInterval(async () => {
            try {
                const res = await fetch(`/public/session/${SESSION_ID}`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    sessionData = data.session;
                    if (!document.getElementById('ordersPanel').classList.contains('hidden')) {
                        renderOrders();
                    }
                }
            } catch (e) {}
        }, 15000);

        // Initial render
        updateCartUI();
    </script>
</body>
</html>
