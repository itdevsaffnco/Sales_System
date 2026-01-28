<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesEntry;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function general(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'sales_manager') {
            abort(403);
        }

        $data = $request->validate([
            'date_from' => ['sometimes', 'date'],
            'date_to' => ['sometimes', 'date'],
        ]);

        $query = SalesEntry::query();

        if (isset($data['date_from'])) {
            $query->whereDate('sales_date', '>=', $data['date_from']);
        }

        if (isset($data['date_to'])) {
            $query->whereDate('sales_date', '<=', $data['date_to']);
        }

        $byChannel = (clone $query)
            ->selectRaw('channel_distribution, COUNT(*) as entries_count, COALESCE(MAX(pricing_rsp_new), 0) as max_pricing_rsp_new')
            ->groupBy('channel_distribution')
            ->orderByDesc('entries_count')
            ->get();

        $topChannel = $byChannel->first();

        return response()->json([
            'total_entries' => (clone $query)->count(),
            'top_channel' => $topChannel ? [
                'channel_distribution' => $topChannel->channel_distribution,
                'entries_count' => (int) $topChannel->entries_count,
                'max_pricing_rsp_new' => (int) $topChannel->max_pricing_rsp_new,
            ] : null,
            'by_channel' => $byChannel->map(fn ($row) => [
                'channel_distribution' => $row->channel_distribution,
                'entries_count' => (int) $row->entries_count,
                'max_pricing_rsp_new' => (int) $row->max_pricing_rsp_new,
            ])->values(),
        ]);
    }
}
