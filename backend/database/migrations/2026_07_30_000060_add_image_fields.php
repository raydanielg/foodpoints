<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->after('phone');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('cover_url')->nullable()->after('logo_url');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar_url');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn('cover_url');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('image_url');
        });
    }
};
