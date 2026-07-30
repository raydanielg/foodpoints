<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@foodpoint.co.tz'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('FoodPoint2024'),
                'role' => 'super_admin',
                'restaurant_id' => null,
            ]
        );
    }
}
