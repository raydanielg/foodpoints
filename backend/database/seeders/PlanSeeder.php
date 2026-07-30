<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free Trial',
                'description' => 'Get started with basic features for 14 days',
                'price' => 0,
                'duration_days' => 14,
                'currency' => 'TZS',
                'features' => ['QR code ordering', 'Up to 20 menu items', '1 table', 'Basic dashboard'],
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'description' => 'Perfect for small restaurants',
                'price' => 25000,
                'duration_days' => 30,
                'currency' => 'TZS',
                'features' => ['QR code ordering', 'Up to 100 menu items', 'Up to 10 tables', 'Kitchen display', 'Split payments', 'Basic analytics'],
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'description' => 'For growing restaurants that need more',
                'price' => 60000,
                'duration_days' => 30,
                'currency' => 'TZS',
                'features' => ['Everything in Basic', 'Unlimited menu items', 'Unlimited tables', 'Advanced analytics', 'Staff management', 'Priority support', 'Custom branding'],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::firstOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
