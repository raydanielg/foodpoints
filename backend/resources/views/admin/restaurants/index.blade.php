@extends('admin.layout')
@section('title', 'Restaurants')

@section('content')
    <div class="page-header">
        <div>
            <h1>Restaurants</h1>
            <p>Manage all restaurants on the platform</p>
        </div>
    </div>

    {{-- Filters --}}
    <form method="GET" class="filters">
        <input type="text" name="search" class="form-input" placeholder="Search name, owner, phone..." value="{{ request('search') }}">
        <select name="status" class="form-select">
            <option value="">All Status</option>
            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
            <option value="suspended" {{ request('status') === 'suspended' ? 'selected' : '' }}>Suspended</option>
            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
        </select>
        <select name="kyc" class="form-select">
            <option value="">All KYC</option>
            <option value="approved" {{ request('kyc') === 'approved' ? 'selected' : '' }}>Approved</option>
            <option value="pending" {{ request('kyc') === 'pending' ? 'selected' : '' }}>Pending</option>
            <option value="rejected" {{ request('kyc') === 'rejected' ? 'selected' : '' }}>Rejected</option>
        </select>
        <button type="submit" class="btn btn-primary">Filter</button>
        <a href="{{ route('admin.restaurants.index') }}" class="btn btn-outline">Reset</a>
    </form>

    <div class="card">
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Owner</th>
                        <th>Phone</th>
                        <th>Plan</th>
                        <th>Subscription</th>
                        <th>KYC</th>
                        <th>Expires</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($restaurants as $restaurant)
                        <tr>
                            <td><a href="{{ route('admin.restaurants.show', $restaurant) }}" style="color: #1a8a4a; font-weight: 600;">{{ $restaurant->name }}</a></td>
                            <td>{{ $restaurant->users->first()?->email ?: '—' }}</td>
                            <td>{{ $restaurant->owner_name ?: '—' }}</td>
                            <td>{{ $restaurant->owner_phone ?: $restaurant->phone ?: '—' }}</td>
                            <td>{{ $restaurant->plan?->name ?: '—' }}</td>
                            <td>
                                <span class="badge badge-{{ $restaurant->subscription_status === 'active' ? 'green' : ($restaurant->subscription_status === 'pending' ? 'amber' : 'red') }}">
                                    {{ ucfirst($restaurant->subscription_status) }}
                                </span>
                            </td>
                            <td>
                                <span class="badge badge-{{ $restaurant->kyc_status === 'approved' ? 'green' : ($restaurant->kyc_status === 'pending' ? 'amber' : 'red') }}">
                                    {{ ucfirst($restaurant->kyc_status) }}
                                </span>
                            </td>
                            <td>{{ $restaurant->subscription_expires_at?->format('M d, Y') ?: '—' }}</td>
                            <td>
                                <div style="display: flex; gap: 0.25rem;">
                                    <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="btn btn-outline btn-sm">View</a>
                                    <a href="{{ route('admin.restaurants.edit', $restaurant) }}" class="btn btn-outline btn-sm">Edit</a>
                                    <form method="POST" action="{{ route('admin.restaurants.toggleStatus', $restaurant) }}" style="display:inline;" onsubmit="return confirm('Toggle status?')">
                                        @csrf
                                        <button type="submit" class="btn btn-danger btn-sm">{{ $restaurant->subscription_status === 'active' ? 'Suspend' : 'Activate' }}</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="9" class="empty">No restaurants found</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{ $restaurants->links() }}
@endsection
