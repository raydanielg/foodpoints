@extends('admin.layout')
@section('title', 'Edit ' . $plan->name)

@section('content')
    <div class="page-header">
        <div>
            <h1>Edit Plan</h1>
            <p>{{ $plan->name }}</p>
        </div>
        <a href="{{ route('admin.plans.index') }}" class="btn btn-outline">Back</a>
    </div>

    <div class="card">
        <div class="card-body">
            <form method="POST" action="{{ route('admin.plans.update', $plan) }}">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label class="form-label">Plan Name</label>
                    <input type="text" name="name" class="form-input" value="{{ old('name', $plan->name) }}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-textarea">{{ old('description', $plan->description) }}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Price</label>
                        <input type="number" step="0.01" name="price" class="form-input" value="{{ old('price', $plan->price) }}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Currency</label>
                        <input type="text" name="currency" class="form-input" value="{{ old('currency', $plan->currency) }}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Duration (days)</label>
                    <input type="number" name="duration_days" class="form-input" value="{{ old('duration_days', $plan->duration_days) }}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Features (one per line)</label>
                    <textarea name="features" class="form-textarea">{{ old('features', is_array($plan->features) ? implode("\n", $plan->features) : '') }}</textarea>
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 600; color: #334155;">
                        <input type="checkbox" name="is_active" {{ old('is_active', $plan->is_active) ? 'checked' : '' }} style="width: 16px; height: 16px; accent-color: #1a8a4a;">
                        Active
                    </label>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <a href="{{ route('admin.plans.index') }}" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
