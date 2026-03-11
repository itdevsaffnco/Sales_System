<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('external_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->index();
            $table->string('endpoint');
            $table->string('email');
            $table->text('password_encrypted')->nullable();
            $table->text('token')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_fetched_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('external_tokens');
    }
};
