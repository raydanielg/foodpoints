@extends('admin.layout')
@section('title', 'Plans')

@section('content')
    <div class="page-header">
        <div>
            <h1>Subscription Plans</h1>
            <p>Create and manage pricing plans for restaurants</p>
        </div>
        <a href="{{ route('admin.plans.create') }}" class="btn btn-primary">+ New Plan</a>
    </div>

    <div class="plans-grid">
        @forelse ($plans as $plan)
            <div class="plan-card">
                <div class="plan-card-header">
                    <h3>{{ $plan->name }}</h3>
                    @if (!$plan->is_active)
                        <span class="badge badge-gray" style="margin-top: 0.5rem;">Inactive</span>
                    @endif
                    <div class="plan-price">
                        {{ number_format($plan->price) }} {{ $plan->currency }}
                        <span>/ {{ $plan->duration_days }} days</span>
                    </div>
                </div>
                <div class="plan-card-body">
                    @if ($plan->description)
                        <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">{{ $plan->description }}</p>
                    @endif
                    @if ($plan->features)
                        <ul class="plan-features">
                            @foreach ($plan->features as $feature)
                                <li>{{ $feature }}</li>
                            @endforeach
                        </ul>
                    @endif
                    <div style="margin-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                        <strong>{{ $plan->restaurants_count }}</strong> restaurant(s) subscribed
                    </div>
                </div>
                <div class="plan-card-footer">
                    <a href="{{ route('admin.plans.edit', $plan) }}" class="btn btn-outline btn-sm">Edit</a>
                    @if ($plan->restaurants_count === 0)
                        <form method="POST" action="{{ route('admin.plans.destroy', $plan) }}" onsubmit="return confirm('Delete this plan?')" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    @endif
                </div>
            </div>
        @empty
            <div class="card">
                <div class="empty">No plans yet. Click "New Plan" to create one.</div>
            </div>
        @endforelse
    </div>
@endsection
