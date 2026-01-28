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
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->unsignedInteger('member_discount')->nullable()->after('brand_voucher');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->dropColumn('member_discount');
        });
    }
};
