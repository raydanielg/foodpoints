@extends('admin.layout')
@section('title', $plan->name)

@section('content')
    <div class="page-header">
        <div>
            <h1>{{ $plan->name }}</h1>
            <p>Plan details</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <a href="{{ route('admin.plans.edit', $plan) }}" class="btn btn-primary">Edit</a>
            <a href="{{ route('admin.plans.index') }}" class="btn btn-outline">Back</a>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon green">
                <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>
            <div class="stat-value">{{ number_format($plan->price) }} {{ $plan->currency }}</div>
            <div class="stat-label">Price</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon blue">
                <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
            </div>
            <div class="stat-value">{{ $plan->duration_days }} days</div>
            <div class="stat-label">Duration</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon purple">
                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div class="stat-value">{{ $plan->restaurants()->count() }}</div>
            <div class="stat-label">Subscribed Restaurants</div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Details</h3></div>
        <div class="card-body">
            @if ($plan->description)
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <div>{{ $plan->description }}</div>
                </div>
            @endif
            @if ($plan->features)
                <div class="form-group">
                    <label class="form-label">Features</label>
                    <ul class="plan-features" style="list-style: none; padding: 0;">
                        @foreach ($plan->features as $feature)
                            <li>{{ $feature }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="form-group">
                <label class="form-label">Status</label>
                <div>
                    <span class="badge badge-{{ $plan->is_active ? 'green' : 'gray' }}">{{ $plan->is_active ? 'Active' : 'Inactive' }}</span>
                </div>
            </div>
        </div>
    </div>
@endsection
