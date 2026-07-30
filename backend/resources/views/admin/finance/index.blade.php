@extends('admin.layout')

@section('title', 'Finance Overview — Admin')
@section('page_title', 'Finance Overview')

@section('content')
<div class="space-y-6">

    {{-- Snippe Status Alert --}}
    @if (!$snippeConfigured)
    <div class="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div>
            <p class="font-semibold">Snippe Payment Gateway Not Configured</p>
            <p class="mt-0.5">Withdrawals will be queued but not automatically processed. <a href="{{ route('admin.finance.snippe') }}" class="underline font-medium">Configure Snippe settings →</a></p>
        </div>
    </div>
    @endif

    {{-- Stats Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {{-- Total Revenue --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden">
            <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-100 opacity-60 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
                    </div>
                    Total Revenue
                </div>
                <p class="mt-3 text-2xl font-extrabold text-gray-800 tabular-nums">{{ number_format((float) $stats['total_revenue'], 2) }}</p>
                <p class="text-xs text-gray-400 mt-0.5">TZS</p>
            </div>
        </div>

        {{-- Total Commission --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden">
            <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-gold-100 opacity-60 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <div class="w-7 h-7 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    </div>
                    Platform Commission
                </div>
                <p class="mt-3 text-2xl font-extrabold text-gold-600 tabular-nums">{{ number_format((float) $stats['total_commission'], 2) }}</p>
                <p class="text-xs text-gray-400 mt-0.5">TZS (1.5% of all revenue)</p>
            </div>
        </div>

        {{-- Total Withdrawn --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden">
            <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-100 opacity-60 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    Total Withdrawn
                </div>
                <p class="mt-3 text-2xl font-extrabold text-gray-800 tabular-nums">{{ number_format((float) $stats['total_withdrawn'], 2) }}</p>
                <p class="text-xs text-gray-400 mt-0.5">TZS paid out to owners</p>
            </div>
        </div>

        {{-- Available Balance --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5 relative overflow-hidden">
            <div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-purple-100 opacity-60 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <div class="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    </div>
                    Available Balance
                </div>
                <p class="mt-3 text-2xl font-extrabold text-gray-800 tabular-nums">{{ number_format((float) $stats['total_available'], 2) }}</p>
                <p class="text-xs text-gray-400 mt-0.5">TZS across all restaurants</p>
            </div>
        </div>
    </div>

    {{-- Secondary Stats --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Today's Revenue</p>
            <p class="text-lg font-bold text-gray-800 tabular-nums mt-1">{{ number_format((float) $stats['today_revenue'], 2) }} TZS</p>
            <p class="text-xs text-emerald-600 mt-0.5">Commission: {{ number_format((float) $stats['today_commission'], 2) }} TZS</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">This Month Revenue</p>
            <p class="text-lg font-bold text-gray-800 tabular-nums mt-1">{{ number_format((float) $stats['month_revenue'], 2) }} TZS</p>
            <p class="text-xs text-emerald-600 mt-0.5">Commission: {{ number_format((float) $stats['month_commission'], 2) }} TZS</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Pending Withdrawals</p>
            <p class="text-lg font-bold text-amber-600 tabular-nums mt-1">{{ $stats['pending_withdrawals'] }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Awaiting processing</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Completed Withdrawals</p>
            <p class="text-lg font-bold text-emerald-600 tabular-nums mt-1">{{ $stats['completed_withdrawals'] }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ number_format((float) $stats['total_withdrawals_amount'], 2) }} TZS total</p>
        </div>
    </div>

    {{-- Charts --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {{-- Revenue Chart --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-700 mb-1">Revenue (Last 7 Days)</h3>
            <p class="text-xs text-gray-400 mb-4">Total payment volume processed</p>
            <div style="height: 250px;">
                <canvas id="revenueChart"></canvas>
            </div>
        </div>

        {{-- Commission Chart --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="text-sm font-bold text-gray-700 mb-1">Platform Commission (Last 7 Days)</h3>
            <p class="text-xs text-gray-400 mb-4">1.5% earned from each transaction</p>
            <div style="height: 250px;">
                <canvas id="commissionChart"></canvas>
            </div>
        </div>
    </div>

    {{-- Top Restaurants --}}
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50">
            <h3 class="text-sm font-bold text-gray-700">Top Restaurants by Revenue</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wide">
                    <tr>
                        <th class="text-left px-6 py-3 font-semibold">Restaurant</th>
                        <th class="text-right px-6 py-3 font-semibold">Revenue</th>
                        <th class="text-right px-6 py-3 font-semibold">Commission (1.5%)</th>
                        <th class="text-right px-6 py-3 font-semibold">Available</th>
                        <th class="text-right px-6 py-3 font-semibold">Withdrawn</th>
                        <th class="text-center px-6 py-3 font-semibold">Payments</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @forelse ($topRestaurants as $r)
                    <tr class="hover:bg-gray-50/30 transition-colors">
                        <td class="px-6 py-3">
                            <div class="flex items-center gap-3">
                                @if ($r->logo_url)
                                <img src="{{ $r->logo_url }}" class="w-8 h-8 rounded-lg object-cover">
                                @else
                                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">{{ strtoupper(substr($r->name, 0, 1)) }}</div>
                                @endif
                                <div>
                                    <p class="font-medium text-gray-800">{{ $r->name }}</p>
                                    <p class="text-xs text-gray-400">{{ $r->owner_name ?? '—' }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-3 text-right font-semibold tabular-nums">{{ number_format((float) $r->revenue, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-gold-600">{{ number_format((float) $r->total_commission, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-emerald-600 font-semibold">{{ number_format((float) $r->available_balance, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums">{{ number_format((float) $r->total_withdrawn, 2) }}</td>
                        <td class="px-6 py-3 text-center tabular-nums">{{ $r->completed_payments }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="px-6 py-8 text-center text-gray-400">No revenue data yet.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Recent Withdrawals --}}
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-700">Recent Withdrawals</h3>
            <a href="{{ route('admin.finance.withdrawals') }}" class="text-xs text-emerald-600 font-medium hover:underline">View all →</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wide">
                    <tr>
                        <th class="text-left px-6 py-3 font-semibold">Restaurant</th>
                        <th class="text-right px-6 py-3 font-semibold">Amount</th>
                        <th class="text-right px-6 py-3 font-semibold">Commission</th>
                        <th class="text-right px-6 py-3 font-semibold">Net</th>
                        <th class="text-center px-6 py-3 font-semibold">Channel</th>
                        <th class="text-center px-6 py-3 font-semibold">Status</th>
                        <th class="text-right px-6 py-3 font-semibold">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @forelse ($recentWithdrawals as $w)
                    <tr class="hover:bg-gray-50/30 transition-colors">
                        <td class="px-6 py-3 font-medium text-gray-800">{{ $w->restaurant->name ?? '—' }}</td>
                        <td class="px-6 py-3 text-right font-semibold tabular-nums">{{ number_format((float) $w->amount, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-gold-600">{{ number_format((float) $w->commission_amount, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-emerald-600 font-semibold">{{ number_format((float) $w->net_amount, 2) }}</td>
                        <td class="px-6 py-3 text-center">
                            <span class="inline-flex items-center gap-1 text-xs">
                                @if ($w->channel === 'mobile')
                                <span class="text-blue-600">📱 Mobile</span>
                                @else
                                <span class="text-purple-600">🏦 Bank</span>
                                @endif
                            </span>
                        </td>
                        <td class="px-6 py-3 text-center">
                            @if ($w->status === 'completed')
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">✓ Completed</span>
                            @elseif ($w->status === 'pending')
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">⏳ Pending</span>
                            @else
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">✗ Failed</span>
                            @endif
                        </td>
                        <td class="px-6 py-3 text-right text-xs text-gray-500">{{ $w->created_at->format('M d, H:i') }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-6 py-8 text-center text-gray-400">No withdrawals yet.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
    const revData = {{ json_encode($charts['revenue']) }};
    const commData = {{ json_encode($charts['commission']) }};

    // Revenue Chart
    new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
            labels: revData.labels,
            datasets: [{
                label: 'Revenue (TZS)',
                data: revData.data,
                borderColor: '#024938',
                backgroundColor: function(ctx) {
                    const chart = ctx.chart;
                    const {ctx: c, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(2, 73, 56, 0.25)');
                    gradient.addColorStop(1, 'rgba(2, 73, 56, 0.01)');
                    return gradient;
                },
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f9ac00',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#01241f',
                    titleColor: '#f9ac00',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ctx.parsed.y.toLocaleString() + ' TZS'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, callback: (v) => (v/1000).toFixed(0) + 'k' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });

    // Commission Chart
    new Chart(document.getElementById('commissionChart'), {
        type: 'bar',
        data: {
            labels: commData.labels,
            datasets: [{
                label: 'Commission (TZS)',
                data: commData.data,
                backgroundColor: '#f9ac00',
                borderRadius: 6,
                barThickness: 30,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#01241f',
                    titleColor: '#f9ac00',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ctx.parsed.y.toLocaleString() + ' TZS'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, callback: (v) => (v/1000).toFixed(1) + 'k' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
</script>
@endpush
@endsection
