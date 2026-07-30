@extends('admin.layout')
@section('title', 'Create Plan')

@section('content')
    <div class="page-header">
        <div>
            <h1>Create Plan</h1>
            <p>Add a new subscription plan</p>
        </div>
        <a href="{{ route('admin.plans.index') }}" class="btn btn-outline">Back</a>
    </div>

    <div class="card">
        <div class="card-body">
            <form method="POST" action="{{ route('admin.plans.store') }}">
                @csrf

                <div class="form-group">
                    <label class="form-label">Plan Name</label>
                    <input type="text" name="name" class="form-input" value="{{ old('name') }}" placeholder="e.g. Basic, Pro, Enterprise" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-textarea" placeholder="Short description of the plan">{{ old('description') }}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Price</label>
                        <input type="number" step="0.01" name="price" class="form-input" value="{{ old('price', '0') }}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Currency</label>
                        <input type="text" name="currency" class="form-input" value="{{ old('currency', 'TZS') }}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Duration (days)</label>
                    <input type="number" name="duration_days" class="form-input" value="{{ old('duration_days', '30') }}" required>
                    <div class="form-help">How many days the subscription lasts after payment</div>
                </div>

                <div class="form-group">
                    <label class="form-label">Features (one per line)</label>
                    <textarea name="features" class="form-textarea" placeholder="QR code ordering&#10;Split payments&#10;Kitchen display&#10;Up to 50 menu items">{{ old('features') }}</textarea>
                    <div class="form-help">Each line will be shown as a feature with a checkmark</div>
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 600; color: #334155;">
                        <input type="checkbox" name="is_active" checked style="width: 16px; height: 16px; accent-color: #1a8a4a;">
                        Active (restaurants can subscribe to this plan)
                    </label>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary">Create Plan</button>
                    <a href="{{ route('admin.plans.index') }}" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
