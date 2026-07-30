<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('session_id')->nullable()->change();
            $table->string('payment_type')->default('order')->after('id');
            $table->foreignId('plan_id')->nullable()->after('restaurant_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_type');
            $table->dropColumn('plan_id');
            $table->foreignId('session_id')->nullable(false)->change();
        });
    }
};
