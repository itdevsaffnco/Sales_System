<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('platforms')) {
            Schema::create('platforms', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->string('type')->nullable();
                $table->text('gmv_formula')->nullable();
                $table->text('gmv_after_support_formula')->nullable();
            });
            return;
        }

        Schema::table('platforms', function (Blueprint $table) {
            if (! Schema::hasColumn('platforms', 'gmv_formula')) {
                $table->text('gmv_formula')->nullable();
            }
            if (! Schema::hasColumn('platforms', 'gmv_after_support_formula')) {
                $table->text('gmv_after_support_formula')->nullable();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('platforms')) {
            return;
        }

        Schema::table('platforms', function (Blueprint $table) {
            if (Schema::hasColumn('platforms', 'gmv_formula')) {
                $table->dropColumn('gmv_formula');
            }
            if (Schema::hasColumn('platforms', 'gmv_after_support_formula')) {
                $table->dropColumn('gmv_after_support_formula');
            }
        });
    }
};
