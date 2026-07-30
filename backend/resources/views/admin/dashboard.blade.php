@extends('admin.layout')
@section('title', 'Dashboard')

@section('content')
    <div class="page-header">
        <div>
            <h1>Dashboard</h1>
            <p>Overview of all restaurants, plans, and subscriptions</p>
        </div>
    </div>

    {{-- Stats --}}
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon green">
                <svg viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['total_restaurants'] }}</div>
            <div class="stat-label">Total Restaurants</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon blue">
                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['total_users'] }}</div>
            <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon purple">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['kyc_approved'] }}</div>
            <div class="stat-label">KYC Approved</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon amber">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['kyc_pending'] }}</div>
            <div class="stat-label">KYC Pending</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon red">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['expired'] }}</div>
            <div class="stat-label">Expired Subscriptions</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon green">
                <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>
            <div class="stat-value">{{ $stats['active_subscriptions'] }}</div>
            <div class="stat-label">Active Subscriptions</div>
        </div>
    </div>

    {{-- Expiring soon alert --}}
    @if ($stats['expiring_soon'] > 0)
        <div class="alert-box alert-warning">
            <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
            <div>
                <h4>{{ $stats['expiring_soon'] }} subscription(s) expiring within 7 days</h4>
                <p><a href="{{ route('admin.subscriptions.index') }}" style="color: #92400e; font-weight: 600;">View subscriptions →</a></p>
            </div>
        </div>
    @endif

    {{-- Expired alert --}}
    @if ($stats['expired'] > 0)
        <div class="alert-box alert-danger">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
            <div>
                <h4>{{ $stats['expired'] }} subscription(s) have expired</h4>
                <p>These restaurants need to pay to continue using the platform. <a href="{{ route('admin.subscriptions.index') }}" style="color: #991b1b; font-weight: 600;">View →</a></p>
            </div>
        </div>
    @endif

    {{-- Recent restaurants --}}
    <div class="card">
        <div class="card-header">
            <div>
                <h3>Recent Restaurants</h3>
                <p>Latest registered restaurants</p>
            </div>
            <a href="{{ route('admin.restaurants.index') }}" class="btn btn-outline btn-sm">View All</a>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Plan</th>
                        <th>Subscription</th>
                        <th>KYC</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($restaurants as $restaurant)
                        <tr>
                            <td><a href="{{ route('admin.restaurants.show', $restaurant) }}" style="color: #1a8a4a; font-weight: 600;">{{ $restaurant->name }}</a></td>
                            <td>{{ $restaurant->users->first()?->email ?: '—' }}</td>
                            <td>{{ $restaurant->owner_phone ?: $restaurant->phone ?: '—' }}</td>
                            <td>{{ $restaurant->plan?->name ?: '—' }}</td>
                            <td>
                                @if ($restaurant->subscription_expires_at)
                                    @if ($restaurant->subscription_expires_at->isPast())
                                        <span class="badge badge-red">Expired</span>
                                    @elseif ($restaurant->subscription_expires_at->lte(now()->addDays(7)))
                                        <span class="badge badge-amber">Expires {{ $restaurant->subscription_expires_at->diffForHumans() }}</span>
                                    @else
                                        <span class="badge badge-green">Active</span>
                                    @endif
                                @else
                                    <span class="badge badge-gray">No plan</span>
                                @endif
                            </td>
                            <td>
                                <span class="badge badge-{{ $restaurant->kyc_status === 'approved' ? 'green' : ($restaurant->kyc_status === 'pending' ? 'amber' : 'red') }}">
                                    {{ ucfirst($restaurant->kyc_status) }}
                                </span>
                            </td>
                            <td>{{ $restaurant->created_at?->format('M d, Y') }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="7" class="empty">No restaurants found</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
