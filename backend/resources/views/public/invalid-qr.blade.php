<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Invalid QR Code — FoodPoint</title>
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito:400,500,600,700,800,900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { theme: { extend: {
            colors: { emerald: { 500:'#024938',600:'#023d30',700:'#013028',800:'#01241f',900:'#001816' }, gold: { 400:'#ffb71a',500:'#f9ac00',600:'#d49700' } }
        }}
    </script>
    <style>
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        .float { animation: float 3s ease-in-out infinite; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }
        .fade-in { animation: fadeIn 0.5s ease-out both; }
    </style>
</head>
<body class="font-['Nunito',sans-serif] antialiased bg-gradient-to-br from-emerald-800 via-emerald-900 to-gray-900 min-h-screen flex items-center justify-center p-6">

    <div class="max-w-md w-full text-center">
        {{-- Floating icon --}}
        <div class="float mb-6">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto shadow-2xl rotate-6">
                <svg class="w-10 h-10 text-white -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
        </div>

        <div class="fade-in">
            @if ($reason ?? '' === 'inactive')
            <h1 class="text-2xl font-extrabold text-white mb-2">Restaurant Unavailable</h1>
            <p class="text-emerald-200/70 text-sm mb-8">This restaurant is currently not available on FoodPoint. Please try again later.</p>
            @else
            <h1 class="text-2xl font-extrabold text-white mb-2">Invalid QR Code</h1>
            <p class="text-emerald-200/70 text-sm mb-8">This QR code doesn't match any table. Please scan the QR code on your table or enter your table number below.</p>
            @endif
        </div>

        {{-- Action buttons --}}
        <div class="fade-in space-y-3" style="animation-delay: 0.15s">
            <a href="/" class="block w-full py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-gray-900 font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-transform">
                Go to Home
            </a>
            <p class="text-emerald-300/40 text-xs">Powered by FoodPoint</p>
        </div>
    </div>

</body>
</html>
