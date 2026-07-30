@extends('admin.layout')
@section('title', $restaurant->name)

@section('content')
    <div class="page-header">
        <div>
            <h1>{{ $restaurant->name }}</h1>
            <p>Restaurant details and management</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <a href="{{ route('admin.restaurants.edit', $restaurant) }}" class="btn btn-primary">Edit</a>
            <a href="{{ route('admin.restaurants.index') }}" class="btn btn-outline">Back</a>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon {{ $restaurant->subscription_status === 'active' ? 'green' : 'red' }}">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="stat-value" style="font-size: 1rem;">{{ ucfirst($restaurant->subscription_status) }}</div>
            <div class="stat-label">Subscription</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon {{ $restaurant->kyc_status === 'approved' ? 'green' : 'amber' }}">
                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <div class="stat-value" style="font-size: 1rem;">{{ ucfirst($restaurant->kyc_status) }}</div>
            <div class="stat-label">KYC Status</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon blue">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"/></svg>
            </div>
            <div class="stat-value" style="font-size: 1rem;">{{ $restaurant->plan?->name ?: 'No Plan' }}</div>
            <div class="stat-label">Current Plan</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon amber">
                <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            </div>
            <div class="stat-value" style="font-size: 1rem;">{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</div>
            <div class="stat-label">Expires</div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Restaurant Information</h3></div>
        <div class="card-body">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <div>{{ $restaurant->name }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <div>{{ $restaurant->phone ?: '—' }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Address</label>
                    <div>{{ $restaurant->address ?: '—' }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Currency</label>
                    <div>{{ $restaurant->currency }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Restaurant Link</label>
                    <div>{{ $restaurant->restaurant_link ?: '—' }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">VAT (%)</label>
                    <div>{{ $restaurant->vat_percent }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>KYC Details</h3></div>
        <div class="card-body">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Owner Name</label>
                    <div>{{ $restaurant->owner_name ?: '—' }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Owner Phone</label>
                    <div>{{ $restaurant->owner_phone ?: '—' }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">ID Type</label>
                    <div>{{ ucfirst(str_replace('_', ' ', $restaurant->owner_id_type ?: '—')) }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">ID Number</label>
                    <div>{{ $restaurant->owner_id_number ?: '—' }}</div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Business Type</label>
                    <div>{{ ucfirst($restaurant->business_type ?: '—') }}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">TIN Number</label>
                    <div>{{ $restaurant->tin_number ?: '—' }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Users</h3></div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
                </thead>
                <tbody>
                    @forelse ($restaurant->users as $user)
                        <tr>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td><span class="badge badge-blue">{{ ucfirst(str_replace('_', ' ', $user->role)) }}</span></td>
                        </tr>
                    @empty
                        <tr><td colspan="3" class="empty">No users</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Assign Plan / Record Payment --}}
    <div class="card">
        <div class="card-header"><h3>Subscription Management</h3></div>
        <div class="card-body">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <form method="POST" action="{{ route('admin.subscriptions.pay', $restaurant) }}" style="display: flex; gap: 0.5rem; align-items: end;">
                    @csrf
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">Record Payment & Assign Plan</label>
                        <select name="plan_id" class="form-select" required>
                            <option value="">Select Plan...</option>
                            @foreach (\App\Models\Plan::where('is_active', true)->orderBy('price')->get() as $plan)
                                <option value="{{ $plan->id }}" {{ $restaurant->plan_id === $plan->id ? 'selected' : '' }}>{{ $plan->name }} — {{ number_format($plan->price) }} {{ $plan->currency }} ({{ $plan->duration_days }} days)</option>
                            @endforeach
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Record Payment</button>
                </form>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <form method="POST" action="{{ route('admin.subscriptions.extend', $restaurant) }}" style="display: flex; gap: 0.5rem; align-items: end;">
                    @csrf
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label">Extend (days)</label>
                        <input type="number" name="days" class="form-input" style="width: 100px;" min="1" value="30" required>
                    </div>
                    <button type="submit" class="btn btn-outline">Extend</button>
                </form>
                @if ($restaurant->subscription_status === 'active')
                    <form method="POST" action="{{ route('admin.subscriptions.suspend', $restaurant) }}" style="display:inline;">
                        @csrf
                        <button type="submit" class="btn btn-danger">Suspend</button>
                    </form>
                @else
                    <form method="POST" action="{{ route('admin.subscriptions.activate', $restaurant) }}" style="display:inline;">
                        @csrf
                        <button type="submit" class="btn btn-primary">Activate</button>
                    </form>
                @endif
            </div>
        </div>
    </div>

    {{-- Danger zone --}}
    <div class="card">
        <div class="card-header"><h3 style="color: #dc2626;">Danger Zone</h3></div>
        <div class="card-body">
            <form method="POST" action="{{ route('admin.restaurants.destroy', $restaurant) }}" onsubmit="return confirm('Are you sure? This will permanently delete the restaurant and all its data.')">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger">Delete Restaurant</button>
            </form>
        </div>
    </div>
@endsection
