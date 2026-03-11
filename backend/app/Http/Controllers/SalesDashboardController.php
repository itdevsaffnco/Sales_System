<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesDashboardController extends Controller
{
    public function index(Request $request)
    {
        $selectedChannel = (string) $request->query('channel', '');
        $searchQuery = (string) $request->query('q', '');

        return view('sales_dashboard', [
            'selected_channel' => $selectedChannel !== '' ? $selectedChannel : null,
            'search_query' => $searchQuery,
            'total_sales' => 0,
            'total_entries' => 0,
            'avg_order_value' => 0,
            'active_channels' => 0,
            'recent_entries' => [],
        ]);
    }

    public function export(Request $request)
    {
        $response = new StreamedResponse(function () {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['date', 'account', 'channel', 'sku_code', 'sku_name', 'qty', 'price']);
            fclose($out);
        });
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename=\"sales_export.csv\"');
        return $response;
    }

    public function delete(Request $request, int $id)
    {
        return redirect()->route('dashboard.sales')->with('status', 'Entry deleted');
    }
}
