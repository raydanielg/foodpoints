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
            $table->string('owner_name')->nullable()->after('name');
            $table->string('owner_phone')->nullable()->after('owner_name');
            $table->enum('owner_id_type', ['national_id', 'passport', 'driving_license'])->nullable()->after('owner_phone');
            $table->string('owner_id_number')->nullable()->after('owner_id_type');
            $table->enum('business_type', ['individual', 'company', 'partnership'])->nullable()->after('owner_id_number');
            $table->string('tin_number')->nullable()->after('business_type');
            $table->string('restaurant_link')->nullable()->after('tin_number');
            $table->enum('kyc_status', ['pending', 'approved', 'rejected'])->default('pending')->after('restaurant_link');
            $table->timestamp('kyc_submitted_at')->nullable()->after('kyc_status');
            $table->timestamp('kyc_approved_at')->nullable()->after('kyc_submitted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
