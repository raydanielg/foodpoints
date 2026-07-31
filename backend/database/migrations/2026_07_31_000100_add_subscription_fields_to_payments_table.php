<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make session_id nullable (raw SQL since doctrine/dbal is not installed)
        DB::statement('ALTER TABLE payments MODIFY session_id BIGINT UNSIGNED NULL');

        // Add payment_type and plan_id columns
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_type')->default('order')->after('id');
            $table->foreignId('plan_id')->nullable()->after('restaurant_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_type');
            $table->dropColumn('plan_id');
        });

        DB::statement('ALTER TABLE payments MODIFY session_id BIGINT UNSIGNED NOT NULL');
    }
};
