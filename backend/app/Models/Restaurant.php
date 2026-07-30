<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_url',
        'cover_url',
        'address',
        'phone',
        'currency',
        'vat_percent',
        'subscription_status',
        'plan_id',
        'subscription_expires_at',
        'owner_name',
        'owner_phone',
        'owner_id_type',
        'owner_id_number',
        'business_type',
        'tin_number',
        'restaurant_link',
        'kyc_status',
        'kyc_submitted_at',
        'kyc_approved_at',
        'payout_channel',
        'payout_phone',
        'payout_bank',
        'payout_bank_account',
        'payout_recipient_name',
        'available_balance',
        'total_earned',
        'total_withdrawn',
        'total_commission',
    ];

    protected function casts(): array
    {
        return [
            'vat_percent' => 'decimal:2',
            'kyc_submitted_at' => 'datetime',
            'kyc_approved_at' => 'datetime',
            'subscription_expires_at' => 'datetime',
            'available_balance' => 'decimal:2',
            'total_earned' => 'decimal:2',
            'total_withdrawn' => 'decimal:2',
            'total_commission' => 'decimal:2',
        ];
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(RestaurantTable::class);
    }

    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(TableSession::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }
}
