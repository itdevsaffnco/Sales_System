<?php

namespace Tests\Feature;

use App\Models\SalesEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SalesEntryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_create_sales_entry(): void
    {
        $user = User::query()->create([
            'name' => 'Sales Staff',
            'email' => 'staff@test.local',
            'password' => 'password123',
            'role' => 'sales_staff',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/sales-entries', [
            'entry_type' => 'online',
            'date_period' => '2026-01',
            'platform' => 'SHOPEE',
            'sku_name' => 'Test SKU',
            'sku_code' => 'SKU-001',
            'pricing_rsp_new' => 12000,
            'qty' => 2,
            'brand_disc' => 0,
            'brand_voucher' => 0,
            'revenue' => 24000,
        ]);

        $response->assertCreated();
        $this->assertDatabaseCount('sales_entries', 1);
    }

    public function test_manager_can_access_general_dashboard(): void
    {
        $manager = User::query()->create([
            'name' => 'Sales Manager',
            'email' => 'manager@test.local',
            'password' => 'password123',
            'role' => 'sales_manager',
        ]);

        SalesEntry::query()->create([
            'user_id' => $manager->id,
            'sales_date' => '2026-01-12',
            'entry_type' => 'online',
            'date_period' => '2026-01',
            'platform' => 'SHOPEE',
            'sku_name' => 'Test SKU',
            'sku_code' => 'SKU-001',
            'status' => 'Active',
            'channel_distribution' => 'SHOPEE',
            'pricing_rsp_new' => 12000,
            'qty' => 2,
            'brand_disc' => 0,
            'brand_voucher' => 0,
            'revenue' => 24000,
            'category' => 'online',
        ]);

        Sanctum::actingAs($manager);

        $response = $this->getJson('/api/dashboard/general');
        $response->assertOk();
        $response->assertJsonStructure([
            'total_entries',
            'top_channel',
            'by_channel',
        ]);
    }
}
