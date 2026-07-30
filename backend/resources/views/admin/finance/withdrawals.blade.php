@extends('admin.layout')

@section('title', 'Withdrawals — Admin')
@section('page_title', 'All Withdrawals')

@section('content')
<div class="space-y-6">

    {{-- Stats Summary --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Total Withdrawn</p>
            <p class="text-lg font-bold text-gray-800 tabular-nums mt-1">{{ number_format((float) $withdrawals->where('status', 'completed')->sum('amount'), 2) }} TZS</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Total Commission Earned</p>
            <p class="text-lg font-bold text-gold-600 tabular-nums mt-1">{{ number_format((float) $withdrawals->where('status', 'completed')->sum('commission_amount'), 2) }} TZS</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Pending</p>
            <p class="text-lg font-bold text-amber-600 tabular-nums mt-1">{{ $withdrawals->where('status', 'pending')->count() }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4">
            <p class="text-xs text-gray-500 font-medium">Failed</p>
            <p class="text-lg font-bold text-red-500 tabular-nums mt-1">{{ $withdrawals->where('status', 'failed')->count() }}</p>
        </div>
    </div>

    {{-- Withdrawals Table --}}
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50">
            <h3 class="text-sm font-bold text-gray-700">All Withdrawal Requests</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wide">
                    <tr>
                        <th class="text-left px-6 py-3 font-semibold">ID</th>
                        <th class="text-left px-6 py-3 font-semibold">Restaurant</th>
                        <th class="text-right px-6 py-3 font-semibold">Amount</th>
                        <th class="text-right px-6 py-3 font-semibold">Commission</th>
                        <th class="text-right px-6 py-3 font-semibold">Net Amount</th>
                        <th class="text-center px-6 py-3 font-semibold">Channel</th>
                        <th class="text-left px-6 py-3 font-semibold">Recipient</th>
                        <th class="text-center px-6 py-3 font-semibold">Status</th>
                        <th class="text-left px-6 py-3 font-semibold">Reference</th>
                        <th class="text-right px-6 py-3 font-semibold">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @forelse ($withdrawals as $w)
                    <tr class="hover:bg-gray-50/30 transition-colors">
                        <td class="px-6 py-3 text-xs text-gray-400">#{{ $w->id }}</td>
                        <td class="px-6 py-3 font-medium text-gray-800">{{ $w->restaurant->name ?? '—' }}</td>
                        <td class="px-6 py-3 text-right font-semibold tabular-nums">{{ number_format((float) $w->amount, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-gold-600">{{ number_format((float) $w->commission_amount, 2) }}</td>
                        <td class="px-6 py-3 text-right tabular-nums text-emerald-600 font-semibold">{{ number_format((float) $w->net_amount, 2) }}</td>
                        <td class="px-6 py-3 text-center">
                            @if ($w->channel === 'mobile')
                            <span class="text-xs text-blue-600">📱 Mobile</span>
                            @else
                            <span class="text-xs text-purple-600">🏦 Bank</span>
                            @endif
                        </td>
                        <td class="px-6 py-3">
                            <p class="text-xs font-medium text-gray-700">{{ $w->recipient_name }}</p>
                            <p class="text-xs text-gray-400">
                                @if ($w->channel === 'mobile')
                                    {{ $w->recipient_phone }}
                                @else
                                    {{ $w->recipient_bank }} · {{ $w->recipient_account }}
                                @endif
                            </p>
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
                        <td class="px-6 py-3 text-xs text-gray-400">{{ $w->snippe_reference ?? '—' }}</td>
                        <td class="px-6 py-3 text-right text-xs text-gray-500">{{ $w->created_at->format('M d, Y H:i') }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="10" class="px-6 py-12 text-center text-gray-400">
                            <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            No withdrawals yet.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Pagination --}}
        @if ($withdrawals->hasPages())
        <div class="px-6 py-4 border-t border-gray-50">
            {{ $withdrawals->links() }}
        </div>
        @endif
    </div>

</div>
@endsection
