<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Owner Portal') — FoodPoint</title>
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito:400,500,600,700,800,900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { theme: { extend: {
            colors: { emerald: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b' }, gold: { 300:'#fde68a',400:'#fbbf24',500:'#f59e0b',600:'#d97706' } },
            fontFamily: { sans: ['Nunito', 'sans-serif'] }
        }}}
    </script>
    <style>
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .fade-in { animation: fadeIn 0.3s ease-out both; }
        .nav-active { background: linear-gradient(to right, rgba(255,255,255,0.15), transparent); border-left: 3px solid #fbbf24; }
    </style>
</head>
<body class="font-sans antialiased bg-gray-50 min-h-screen">

<div class="flex min-h-screen">
    {{-- Sidebar --}}
    <aside class="w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
        <div class="p-5 border-b border-white/10">
            <div class="flex items-center gap-3">
                @if ($restaurant->logo_url ?? null)
                <img src="{{ $restaurant->logo_url }}" class="w-10 h-10 rounded-xl object-cover">
                @else
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-extrabold text-gray-900">{{ substr($restaurant->name ?? 'FP', 0, 1) }}</div>
                @endif
                <div class="min-w-0">
                    <p class="font-bold text-sm truncate">{{ $restaurant->name ?? 'FoodPoint' }}</p>
                    <p class="text-[10px] text-emerald-300">Owner Portal</p>
                </div>
            </div>
        </div>

        <nav class="flex-1 py-4 space-y-1 px-3">
            <a href="{{ route('owner.dashboard') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('owner.dashboard') ? 'nav-active text-white' : 'text-emerald-200 hover:bg-white/5' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Dashboard
            </a>
            <a href="{{ route('owner.transactions') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('owner.transactions') ? 'nav-active text-white' : 'text-emerald-200 hover:bg-white/5' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                Transactions
            </a>
            <a href="{{ route('owner.withdrawals') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('owner.withdrawals') ? 'nav-active text-white' : 'text-emerald-200 hover:bg-white/5' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                Withdrawals
            </a>
            <a href="{{ route('owner.payout-settings') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all {{ request()->routeIs('owner.payout-settings') ? 'nav-active text-white' : 'text-emerald-200 hover:bg-white/5' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Payout Settings
            </a>
        </nav>

        <div class="p-4 border-t border-white/10">
            <div class="bg-white/5 rounded-xl p-3 mb-3">
                <p class="text-[10px] text-emerald-300 font-medium uppercase tracking-wide">Available Balance</p>
                <p class="text-lg font-extrabold text-gold-300">{{ number_format((float)($restaurant->available_balance ?? 0), 2) }} TZS</p>
            </div>
            <form method="POST" action="{{ route('owner.logout') }}">
                @csrf
                <button type="submit" class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-semibold transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Logout
                </button>
            </form>
        </div>
    </aside>

    {{-- Mobile header --}}
    <div class="md:hidden fixed top-0 inset-x-0 bg-emerald-900 text-white z-30 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-extrabold text-gray-900 text-sm">{{ substr($restaurant->name ?? 'FP', 0, 1) }}</div>
            <span class="font-bold text-sm">{{ $restaurant->name ?? 'FoodPoint' }}</span>
        </div>
        <select onchange="window.location.href=this.value" class="bg-emerald-800 text-white text-xs rounded-lg px-2 py-1.5 border-0 outline-none">
            <option value="{{ route('owner.dashboard') }}" @if(request()->routeIs('owner.dashboard')) selected @endif>Dashboard</option>
            <option value="{{ route('owner.transactions') }}" @if(request()->routeIs('owner.transactions')) selected @endif>Transactions</option>
            <option value="{{ route('owner.withdrawals') }}" @if(request()->routeIs('owner.withdrawals')) selected @endif>Withdrawals</option>
            <option value="{{ route('owner.payout-settings') }}" @if(request()->routeIs('owner.payout-settings')) selected @endif>Payout Settings</option>
        </select>
    </div>

    {{-- Main content --}}
    <main class="flex-1 md:ml-64 pt-14 md:pt-0">
        <div class="p-4 md:p-8 max-w-6xl mx-auto">
            @if (session('success'))
            <div class="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-semibold fade-in">
                {{ session('success') }}
            </div>
            @endif
            @if (session('error'))
            <div class="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-semibold fade-in">
                {{ session('error') }}
            </div>
            @endif
            @if (session('warning'))
            <div class="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700 font-semibold fade-in">
                {{ session('warning') }}
            </div>
            @endif

            @yield('content')
        </div>
    </main>
</div>

@stack('scripts')
</body>
</html>
