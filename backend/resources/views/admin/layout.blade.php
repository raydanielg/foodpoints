<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') — FoodPoint Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f1f5f9;
            min-height: 100vh;
            display: flex;
        }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }

        /* Sidebar */
        .sidebar {
            width: 240px;
            shrink: 0;
            background: #0f172a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0; top: 0; bottom: 0;
        }
        .sidebar-logo {
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.625rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar-logo-icon {
            width: 36px; height: 36px; border-radius: 8px;
            background: linear-gradient(135deg, #1a8a4a, #16a34a);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .sidebar-logo-icon svg { width: 20px; height: 20px; fill: white; }
        .sidebar-logo-text { color: white; }
        .sidebar-logo-text h3 { font-size: 0.9375rem; font-weight: 800; }
        .sidebar-logo-text p { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }

        .sidebar-nav { padding: 0.75rem; flex: 1; overflow-y: auto; }
        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.625rem 0.875rem;
            border-radius: 8px;
            font-size: 0.8125rem;
            font-weight: 600;
            color: rgba(255,255,255,0.6);
            transition: all 0.15s;
            margin-bottom: 2px;
        }
        .sidebar-nav a:hover { background: rgba(255,255,255,0.08); color: white; }
        .sidebar-nav a.active { background: #1a8a4a; color: white; }
        .sidebar-nav a svg { width: 16px; height: 16px; fill: currentColor; flex-shrink: 0; }

        .sidebar-section {
            font-size: 0.625rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.3);
            padding: 1rem 0.875rem 0.5rem;
        }

        /* Main */
        .main {
            margin-left: 240px;
            flex: 1;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .topbar {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.75rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .topbar-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
        .topbar-right { display: flex; align-items: center; gap: 1rem; }
        .topbar-user { font-size: 0.8125rem; color: #64748b; }
        .topbar-user strong { color: #0f172a; }
        .btn-logout {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
        }
        .btn-logout:hover { background: #fee2e2; }

        .content { padding: 1.5rem; flex: 1; }

        /* Flash messages */
        .flash {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.8125rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .flash-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .flash-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        /* Cards */
        .card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            margin-bottom: 1.25rem;
        }
        .card-header {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .card-header h3 { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .card-header p { font-size: 0.75rem; color: #64748b; margin-top: 0.125rem; }
        .card-body { padding: 1.25rem; }

        /* Stats grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .stat-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 1.25rem;
        }
        .stat-icon {
            width: 40px; height: 40px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 0.75rem;
        }
        .stat-icon svg { width: 20px; height: 20px; fill: white; }
        .stat-icon.green { background: linear-gradient(135deg, #1a8a4a, #16a34a); }
        .stat-icon.blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
        .stat-icon.purple { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
        .stat-icon.amber { background: linear-gradient(135deg, #d97706, #f59e0b); }
        .stat-icon.red { background: linear-gradient(135deg, #dc2626, #ef4444); }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .stat-label { font-size: 0.75rem; color: #64748b; margin-top: 0.125rem; }

        /* Tables */
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f8fafc; }
        th {
            text-align: left;
            padding: 0.625rem 1rem;
            font-size: 0.6875rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }
        td {
            padding: 0.75rem 1rem;
            font-size: 0.8125rem;
            color: #334155;
            border-top: 1px solid #f1f5f9;
        }
        tr:hover td { background: #f8fafc; }

        /* Badges */
        .badge {
            display: inline-flex;
            padding: 0.2rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.625rem;
            font-weight: 600;
            white-space: nowrap;
        }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f1f5f9; color: #475569; }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.5rem 0.875rem;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 6px;
            border: none;
            transition: all 0.15s;
            white-space: nowrap;
        }
        .btn svg { width: 14px; height: 14px; fill: currentColor; }
        .btn-primary { background: #1a8a4a; color: white; }
        .btn-primary:hover { background: #15803d; }
        .btn-outline { background: white; color: #334155; border: 1px solid #e2e8f0; }
        .btn-outline:hover { background: #f8fafc; }
        .btn-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .btn-danger:hover { background: #fee2e2; }
        .btn-sm { padding: 0.3rem 0.5rem; font-size: 0.6875rem; }

        /* Forms */
        .form-group { margin-bottom: 1rem; }
        .form-label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 0.375rem;
        }
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            outline: none;
            transition: all 0.15s;
            background: white;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            border-color: #1a8a4a;
            box-shadow: 0 0 0 2px rgba(26,138,74,0.1);
        }
        .form-textarea { min-height: 80px; resize: vertical; }
        .form-help { font-size: 0.6875rem; color: #94a3b8; margin-top: 0.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* Filters */
        .filters {
            display: flex;
            gap: 0.625rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }
        .filters .form-input, .filters .form-select { width: auto; min-width: 160px; }

        /* Pagination */
        .pagination { display: flex; gap: 0.25rem; margin-top: 1rem; justify-content: center; }
        .pagination a, .pagination span {
            padding: 0.375rem 0.625rem;
            font-size: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            color: #334155;
        }
        .pagination .active { background: #1a8a4a; color: white; border-color: #1a8a4a; }

        /* Empty state */
        .empty { text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.8125rem; }

        /* Page header */
        .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
        }
        .page-header h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .page-header p { font-size: 0.8125rem; color: #64748b; margin-top: 0.125rem; }

        /* Alert boxes */
        .alert-box {
            border-radius: 10px;
            padding: 1rem 1.25rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        .alert-box svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; margin-top: 1px; }
        .alert-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
        .alert-danger { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        .alert-box h4 { font-size: 0.8125rem; font-weight: 700; margin-bottom: 0.25rem; }
        .alert-box p { font-size: 0.75rem; }

        /* Plan cards */
        .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.25rem;
        }
        .plan-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        .plan-card-header {
            padding: 1.25rem;
            border-bottom: 1px solid #f1f5f9;
        }
        .plan-card-header h3 { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
        .plan-price {
            font-size: 1.75rem;
            font-weight: 800;
            color: #1a8a4a;
            margin-top: 0.5rem;
        }
        .plan-price span { font-size: 0.75rem; font-weight: 500; color: #64748b; }
        .plan-card-body { padding: 1.25rem; }
        .plan-features { list-style: none; }
        .plan-features li {
            font-size: 0.75rem;
            color: #475569;
            padding: 0.25rem 0;
            display: flex;
            align-items: flex-start;
            gap: 0.375rem;
        }
        .plan-features li::before {
            content: "✓";
            color: #1a8a4a;
            font-weight: 700;
            flex-shrink: 0;
        }
        .plan-card-footer {
            padding: 0.75rem 1.25rem;
            border-top: 1px solid #f1f5f9;
            display: flex;
            gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .main { margin-left: 0; }
            .form-row { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-logo">
            <div class="sidebar-logo-icon">
                <svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            </div>
            <div class="sidebar-logo-text">
                <h3>FoodPoint</h3>
                <p>Admin Panel</p>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="sidebar-section">Main</div>
            <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                Dashboard
            </a>
            <a href="{{ route('admin.restaurants.index') }}" class="{{ request()->routeIs('admin.restaurants.*') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
                Restaurants
            </a>

            <div class="sidebar-section">Billing</div>
            <a href="{{ route('admin.plans.index') }}" class="{{ request()->routeIs('admin.plans.*') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                Plans
            </a>
            <a href="{{ route('admin.subscriptions.index') }}" class="{{ request()->routeIs('admin.subscriptions.*') ? 'active' : '' }}">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Subscriptions
            </a>
        </nav>
    </div>

    <div class="main">
        <div class="topbar">
            <div class="topbar-title">@yield('title', 'Dashboard')</div>
            <div class="topbar-right">
                <div class="topbar-user">
                    <strong>{{ auth()->user()->name }}</strong>
                </div>
                <form method="POST" action="{{ route('admin.logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit" class="btn-logout">Logout</button>
                </form>
            </div>
        </div>

        <div class="content">
            @if (session('success'))
                <div class="flash flash-success">{{ session('success') }}</div>
            @endif
            @if (session('error'))
                <div class="flash flash-error">{{ session('error') }}</div>
            @endif

            @yield('content')
        </div>
    </div>
</body>
</html>
