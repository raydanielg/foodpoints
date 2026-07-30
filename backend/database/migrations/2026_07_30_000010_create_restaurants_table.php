<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('currency', 10)->default('TZS');
            $table->decimal('vat_percent', 5, 2)->default(0);
            $table->enum('subscription_status', ['active', 'suspended', 'pending'])->default('pending');
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('restaurant_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('phone')->nullable();
            $table->enum('role', ['super_admin', 'owner', 'manager', 'waiter', 'kitchen'])->default('owner');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
            $table->dropColumn(['restaurant_id', 'phone', 'role']);
        });
        Schema::dropIfExists('restaurants');
    }
};
