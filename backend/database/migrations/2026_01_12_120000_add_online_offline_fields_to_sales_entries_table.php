<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->string('entry_type', 20)->default('offline')->index();
            $table->string('date_period', 50)->nullable()->index();
            $table->string('platform', 50)->nullable()->index();
            $table->string('channel', 100)->nullable()->index();
            $table->string('account', 150)->nullable();
            $table->unsignedInteger('qty')->nullable();
            $table->unsignedInteger('margin')->nullable();
            $table->unsignedInteger('brand_disc')->nullable();
            $table->unsignedInteger('brand_voucher')->nullable();
            $table->unsignedInteger('revenue')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->dropColumn([
                'entry_type',
                'date_period',
                'platform',
                'channel',
                'account',
                'qty',
                'margin',
                'brand_disc',
                'brand_voucher',
                'revenue',
            ]);
        });
    }
};
