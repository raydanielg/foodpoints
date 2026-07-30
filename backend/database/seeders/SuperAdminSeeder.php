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
            ['phone' => '255700000000'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@foodpoint.co.tz',
                'password' => Hash::make('FoodPoint2024'),
                'role' => 'super_admin',
                'restaurant_id' => null,
            ]
        );
    }
}
