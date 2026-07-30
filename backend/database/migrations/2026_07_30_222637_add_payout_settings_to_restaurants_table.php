<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('payout_channel')->default('mobile')->after('tin_number'); // mobile or bank
            $table->string('payout_phone')->nullable()->after('payout_channel');
            $table->string('payout_bank')->nullable()->after('payout_phone');
            $table->string('payout_bank_account')->nullable()->after('payout_bank');
            $table->string('payout_recipient_name')->nullable()->after('payout_bank_account');
            $table->decimal('available_balance', 12, 2)->default(0)->after('payout_recipient_name');
            $table->decimal('total_earned', 12, 2)->default(0)->after('available_balance');
            $table->decimal('total_withdrawn', 12, 2)->default(0)->after('total_earned');
            $table->decimal('total_commission', 12, 2)->default(0)->after('total_withdrawn');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['payout_channel', 'payout_phone', 'payout_bank', 'payout_bank_account', 'payout_recipient_name', 'available_balance', 'total_earned', 'total_withdrawn', 'total_commission']);
        });
    }
};
