<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales_jubelio', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doc_id')->unique();
            $table->string('doc_number')->index();
            $table->integer('contact_id')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('ref_no')->nullable();
            $table->timestamp('transaction_date')->nullable();
            $table->unsignedBigInteger('salesorder_id')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->boolean('is_opening_balance')->default(false);
            $table->decimal('grand_total', 20, 4)->default(0);
            $table->string('doc_type')->nullable();
            $table->integer('age')->nullable();
            $table->integer('age_due')->nullable();
            $table->decimal('due', 20, 4)->default(0);
            $table->timestamp('last_modified')->nullable();
            $table->string('salesman_name')->nullable();
            $table->string('so_customer_name')->nullable();
            $table->timestamp('created_date')->nullable();
            $table->string('store_name')->nullable();
            $table->unsignedBigInteger('store_id')->nullable();
            $table->decimal('downpayment_amount', 20, 4)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_jubelio');
    }
};
