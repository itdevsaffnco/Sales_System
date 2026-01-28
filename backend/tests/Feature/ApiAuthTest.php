<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_token_and_user(): void
    {
        User::query()->create([
            'name' => 'Sales Manager',
            'email' => 'manager@test.local',
            'password' => Hash::make('password123'),
            'role' => 'sales_manager',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'manager@test.local',
            'password' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'token',
            'user' => ['id', 'name', 'email', 'role'],
        ]);
    }

    public function test_staff_login_redirects_to_sales_entry(): void
    {
        User::factory()->create([
            'email' => 'staff@sales.local',
            'password' => Hash::make('password123'),
            'role' => 'sales_staff',
        ]);

        $response = $this->withSession(['_token' => 'test'])->post('/login', [
            '_token' => 'test',
            'email' => 'staff@sales.local',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/sales-entry');
        $this->assertSame('sales_staff', session('user.role'));
    }

    public function test_manager_login_redirects_to_dashboard(): void
    {
        User::factory()->create([
            'email' => 'manager@sales.local',
            'password' => Hash::make('password123'),
            'role' => 'sales_manager',
        ]);

        $response = $this->withSession(['_token' => 'test'])->post('/login', [
            '_token' => 'test',
            'email' => 'manager@sales.local',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard-sales');
        $this->assertSame('sales_manager', session('user.role'));
    }

    public function test_sales_entry_requires_staff_session(): void
    {
        $response = $this->get('/sales-entry');
        $response->assertRedirect('/login');

        $response = $this->withSession([
            'user' => [
                'id' => 1,
                'name' => 'Sales Manager',
                'email' => 'manager@sales.local',
                'role' => 'sales_manager',
            ],
        ])->get('/sales-entry');

        $response->assertRedirect('/dashboard-sales');
    }
}
