<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'manager@sales.local'],
            [
                'name' => 'Sales Manager',
                'password' => Hash::make('password123'),
                'role' => 'sales_manager',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'staff@sales.local'],
            [
                'name' => 'Sales Staff',
                'password' => Hash::make('password123'),
                'role' => 'sales_staff',
            ]
        );
    }
}
