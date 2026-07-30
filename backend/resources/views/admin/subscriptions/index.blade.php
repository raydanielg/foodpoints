@extends('admin.layout')
@section('title', 'Subscriptions')

@section('content')
    <div class="page-header">
        <div>
            <h1>Subscriptions</h1>
            <p>Track and manage restaurant subscription payments</p>
        </div>
    </div>

    {{-- Expiring soon --}}
    @if ($expiringSoon->count() > 0)
        <div class="alert-box alert-warning">
            <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
            <div>
                <h4>{{ $expiringSoon->count() }} subscription(s) expiring within 7 days</h4>
                <p>Contact these restaurants to arrange payment before expiry.</p>
            </div>
        </div>
    @endif

    {{-- Expired --}}
    @if ($expired->count() > 0)
        <div class="alert-box alert-danger">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
            <div>
                <h4>{{ $expired->count() }} subscription(s) have expired</h4>
                <p>These restaurants need payment to continue using the platform.</p>
            </div>
        </div>
    @endif

    <div class="card">
        <div class="card-header">
            <h3>All Subscriptions</h3>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Restaurant</th>
                        <th>Plan</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Expires</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($restaurants as $restaurant)
                        <tr>
                            <td><a href="{{ route('admin.restaurants.show', $restaurant) }}" style="color: #1a8a4a; font-weight: 600;">{{ $restaurant->name }}</a></td>
                            <td>{{ $restaurant->plan?->name ?: '—' }}</td>
                            <td>{{ $restaurant->plan ? number_format($restaurant->plan->price) . ' ' . $restaurant->plan->currency : '—' }}</td>
                            <td>
                                @if ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->isPast())
                                    <span class="badge badge-red">Expired</span>
                                @elseif ($restaurant->subscription_expires_at && $restaurant->subscription_expires_at->lte(now()->addDays(7)))
                                    <span class="badge badge-amber">Expiring Soon</span>
                                @else
                                    <span class="badge badge-{{ $restaurant->subscription_status === 'active' ? 'green' : 'red' }}">{{ ucfirst($restaurant->subscription_status) }}</span>
                                @endif
                            </td>
                            <td>{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</td>
                            <td>
                                <div style="display: flex; gap: 0.25rem;">
                                    <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="btn btn-outline btn-sm">Manage</a>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="empty">No subscriptions found</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{ $restaurants->links() }}
@endsection
