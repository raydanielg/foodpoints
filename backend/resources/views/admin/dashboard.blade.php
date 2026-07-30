<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>FoodPoint Admin — Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f1f5f9;
            min-height: 100vh;
        }
        .header {
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.875rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .header-left { display: flex; align-items: center; gap: 0.75rem; }
        .header-logo {
            width: 36px; height: 36px; border-radius: 8px;
            background: linear-gradient(135deg, #1a8a4a, #16a34a);
            display: flex; align-items: center; justify-content: center;
        }
        .header-logo svg { width: 20px; height: 20px; fill: white; }
        .header-title { font-size: 1.125rem; font-weight: 800; color: #0f172a; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .user-info { font-size: 0.875rem; color: #64748b; }
        .user-info strong { color: #0f172a; }
        .btn-logout {
            padding: 0.5rem 1rem;
            font-size: 0.8125rem;
            font-weight: 600;
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-logout:hover { background: #fee2e2; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
        .page-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem; }
        .page-subtitle { font-size: 0.9375rem; color: #64748b; margin-bottom: 2rem; }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            transition: all 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .stat-icon {
            width: 44px; height: 44px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 1rem;
        }
        .stat-icon svg { width: 22px; height: 22px; fill: white; }
        .stat-icon.green { background: linear-gradient(135deg, #1a8a4a, #16a34a); }
        .stat-icon.blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
        .stat-icon.purple { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
        .stat-icon.amber { background: linear-gradient(135deg, #d97706, #f59e0b); }
        .stat-value { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
        .stat-label { font-size: 0.8125rem; color: #64748b; margin-top: 0.25rem; }
        .section-title {
            font-size: 1.125rem; font-weight: 700; color: #0f172a;
            margin-bottom: 1rem; padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .table-wrapper {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f8fafc; }
        th {
            text-align: left;
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        td {
            padding: 0.875rem 1rem;
            font-size: 0.875rem;
            color: #334155;
            border-top: 1px solid #f1f5f9;
        }
        .status-badge {
            display: inline-flex;
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.6875rem;
            font-weight: 600;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-suspended { background: #fee2e2; color: #991b1b; }
        .kyc-badge {
            display: inline-flex;
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.6875rem;
            font-weight: 600;
        }
        .kyc-approved { background: #dcfce7; color: #166534; }
        .kyc-pending { background: #fef3c7; color: #92400e; }
        .kyc-rejected { background: #fee2e2; color: #991b1b; }
        .empty-row { text-align: center; color: #94a3b8; padding: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="header-logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
            </div>
            <div class="header-title">FoodPoint Admin</div>
        </div>
        <div class="header-right">
            <div class="user-info">
                Welcome, <strong>{{ auth()->user()->name }}</strong>
            </div>
            <form method="POST" action="{{ route('admin.logout') }}" style="display:inline;">
                @csrf
                <button type="submit" class="btn-logout">Logout</button>
            </form>
        </div>
    </div>

    <div class="container">
        <div class="page-title">Dashboard</div>
        <div class="page-subtitle">Overview of all restaurants on the platform</div>

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
        </div>

        {{-- Restaurants table --}}
        <div class="section-title">Restaurants</div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Phone</th>
                        <th>Link</th>
                        <th>Subscription</th>
                        <th>KYC</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($restaurants as $restaurant)
                        <tr>
                            <td><strong>{{ $restaurant->name }}</strong></td>
                            <td>{{ $restaurant->owner_name ?: '—' }}</td>
                            <td>{{ $restaurant->owner_phone ?: $restaurant->phone ?: '—' }}</td>
                            <td>
                                @if ($restaurant->restaurant_link)
                                    <a href="/t/{{ $restaurant->restaurant_link }}" style="color: #1a8a4a; text-decoration: none; font-weight: 600;">/t/{{ $restaurant->restaurant_link }}</a>
                                @else
                                    —
                                @endif
                            </td>
                            <td>
                                <span class="status-badge status-{{ $restaurant->subscription_status }}">
                                    {{ ucfirst($restaurant->subscription_status) }}
                                </span>
                            </td>
                            <td>
                                <span class="kyc-badge kyc-{{ $restaurant->kyc_status }}">
                                    {{ ucfirst($restaurant->kyc_status) }}
                                </span>
                            </td>
                            <td>{{ $restaurant->created_at?->format('M d, Y') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="empty-row">No restaurants found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Users table --}}
        <div class="section-title">Users</div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Restaurant</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($users as $user)
                        <tr>
                            <td><strong>{{ $user->name }}</strong></td>
                            <td>{{ $user->email }}</td>
                            <td>
                                <span class="status-badge status-{{ $user->role === 'super_admin' ? 'active' : 'pending' }}">
                                    {{ ucfirst(str_replace('_', ' ', $user->role)) }}
                                </span>
                            </td>
                            <td>{{ $user->restaurant?->name ?: '—' }}</td>
                            <td>{{ $user->created_at?->format('M d, Y') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="empty-row">No users found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
