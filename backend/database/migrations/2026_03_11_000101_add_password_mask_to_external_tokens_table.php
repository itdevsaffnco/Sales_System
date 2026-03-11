<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('external_tokens', function (Blueprint $table) {
            $table->string('password_mask')->nullable()->after('password_encrypted');
        });
    }

    public function down(): void
    {
        Schema::table('external_tokens', function (Blueprint $table) {
            $table->dropColumn('password_mask');
        });
    }
};
