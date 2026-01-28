<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->text('gmv_formula')->nullable();
            $table->text('gmv_after_support_formula')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sales_entries', function (Blueprint $table) {
            $table->dropColumn([
                'gmv_formula',
                'gmv_after_support_formula',
            ]);
        });
    }
};

