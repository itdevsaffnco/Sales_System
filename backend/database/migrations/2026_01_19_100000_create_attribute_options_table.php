<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attribute_options', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'category', 'status', 'channel_distribution'
            $table->string('value');
            $table->timestamps();

            // Add index for faster lookups
            $table->index(['type', 'value']);
        });

        // Seed initial data
        $categories = [
            'SINGLE - FULL SIZE',
            'SINGLE - TRAVEL SIZE',
            'SINGLE - CLOUD MIST',
            'SINGLE - SHOWER POTION',
            'SINGLE - BODY POTION',
            'SINGLE - ROOM POTION',
            'SINGLE - AMBIENCE MIST',
            'SINGLE - FABRIC POTION',
            'SINGLE - HAND DEW',
            'BUNDLE - REGULAR',
            'BUNDLE - SEASONAL',
        ];

        $statuses = [
            'Active',
            'Deactivate (discontinue)',
            'Not Active',
            'Will be Launch',
        ];

        $channelGroups = [
            'All Channels',
            '[Exc] E-Commerce',
            '[Exc] Modern Trade',
            '[Exc] General Trade',
            '[Exc] Offline Store',
            '[Exc] Pop Up/Event',
        ];

        $data = [];
        $now = now();

        foreach ($categories as $cat) {
            $data[] = ['type' => 'category', 'value' => $cat, 'created_at' => $now, 'updated_at' => $now];
        }
        foreach ($statuses as $st) {
            $data[] = ['type' => 'status', 'value' => $st, 'created_at' => $now, 'updated_at' => $now];
        }
        foreach ($channelGroups as $cg) {
            $data[] = ['type' => 'channel_distribution', 'value' => $cg, 'created_at' => $now, 'updated_at' => $now];
        }

        DB::table('attribute_options')->insert($data);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_options');
    }
};
