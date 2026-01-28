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
        Schema::create('sales_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('sales_date')->index();
            $table->string('sku_name');
            $table->string('sku_code')->index();
            $table->string('category')->index();
            $table->string('status')->index();
            $table->string('channel_distribution')->index();
            $table->unsignedInteger('pricing_rsp_old')->nullable();
            $table->unsignedInteger('pricing_rsp_new')->nullable();
            $table->text('channel_remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_entries');
    }
};
