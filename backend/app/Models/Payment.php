<?php

namespace App\Models;

use App\Models\Plan;
use App\Models\TableSession;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'restaurant_id',
        'plan_id',
        'payment_type',
        'amount',
        'method',
        'split_type',
        'payer_label',
        'payer_phone',
        'status',
        'transaction_ref',
        'snippe_reference',
        'item_ids',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'item_ids' => 'array',
        ];
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(TableSession::class, 'session_id');
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
