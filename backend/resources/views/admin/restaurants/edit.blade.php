@extends('admin.layout')
@section('title', 'Edit ' . $restaurant->name)

@section('content')
    <div class="page-header">
        <div>
            <h1>Edit Restaurant</h1>
            <p>{{ $restaurant->name }}</p>
        </div>
        <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="btn btn-outline">Back</a>
    </div>

    <div class="card">
        <div class="card-header"><h3>Restaurant Details</h3></div>
        <div class="card-body">
            <form method="POST" action="{{ route('admin.restaurants.update', $restaurant) }}">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label class="form-label">Restaurant Name</label>
                    <input type="text" name="name" class="form-input" value="{{ old('name', $restaurant->name) }}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="text" name="phone" class="form-input" value="{{ old('phone', $restaurant->phone) }}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Currency</label>
                        <input type="text" name="currency" class="form-input" value="{{ old('currency', $restaurant->currency) }}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" name="address" class="form-input" value="{{ old('address', $restaurant->address) }}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">VAT (%)</label>
                        <input type="number" step="0.01" name="vat_percent" class="form-input" value="{{ old('vat_percent', $restaurant->vat_percent) }}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Restaurant Link</label>
                        <input type="text" name="restaurant_link" class="form-input" value="{{ old('restaurant_link', $restaurant->restaurant_link) }}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Subscription Status</label>
                        <select name="subscription_status" class="form-select">
                            <option value="active" {{ old('subscription_status', $restaurant->subscription_status) === 'active' ? 'selected' : '' }}>Active</option>
                            <option value="suspended" {{ old('subscription_status', $restaurant->subscription_status) === 'suspended' ? 'selected' : '' }}>Suspended</option>
                            <option value="pending" {{ old('subscription_status', $restaurant->subscription_status) === 'pending' ? 'selected' : '' }}>Pending</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">KYC Status</label>
                        <select name="kyc_status" class="form-select">
                            <option value="pending" {{ old('kyc_status', $restaurant->kyc_status) === 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="approved" {{ old('kyc_status', $restaurant->kyc_status) === 'approved' ? 'selected' : '' }}>Approved</option>
                            <option value="rejected" {{ old('kyc_status', $restaurant->kyc_status) === 'rejected' ? 'selected' : '' }}>Rejected</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <a href="{{ route('admin.restaurants.show', $restaurant) }}" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
