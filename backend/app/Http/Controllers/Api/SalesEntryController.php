<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SalesEntryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'date_from' => ['sometimes', 'date'],
            'date_to' => ['sometimes', 'date'],
            'channel_distribution' => ['sometimes', 'string', 'max:255'],
            'entry_type' => ['sometimes', 'in:online,offline'],
        ]);

        $query = SalesEntry::query()->with('user:id,name,email,role');

        if ($user->role === 'sales_staff') {
            $query->where('user_id', $user->id);
        }

        if (isset($data['date_from'])) {
            $query->whereDate('sales_date', '>=', $data['date_from']);
        }

        if (isset($data['date_to'])) {
            $query->whereDate('sales_date', '<=', $data['date_to']);
        }

        if (isset($data['channel_distribution'])) {
            $query->where('channel_distribution', $data['channel_distribution']);
        }

        if (isset($data['entry_type'])) {
            $query->where('entry_type', $data['entry_type']);
        }

        $items = $query->orderByDesc('sales_date')->orderByDesc('id')->paginate(50);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $type = $request->input('entry_type');

        if ($type) {
            $data = $request->validate([
                'entry_type' => ['required', 'in:online,offline'],
                'date_period' => ['required', 'string', 'max:50'],
                'platform' => ['required_if:entry_type,online', 'nullable', 'string', 'max:50'],
                'channel' => ['required_if:entry_type,offline', 'nullable', 'string', 'max:100'],
                'account' => ['required_if:entry_type,offline', 'nullable', 'string', 'max:150'],
                'sales_date' => ['sometimes', 'date'],
                'sku_name' => ['required', 'string', 'max:255'],
                'sku_code' => ['required', 'string', 'max:255'],
                'pricing_rsp_new' => ['required', 'integer', 'min:0'],
                'pricing_rsp_old' => ['nullable', 'integer', 'min:0'],
                'qty' => ['required', 'integer', 'min:0'],
                'margin' => ['nullable', 'integer', 'min:0'],
                'brand_disc' => ['nullable', 'integer', 'min:0'],
                'brand_voucher' => ['nullable', 'integer', 'min:0'],
                'member_discount' => ['nullable', 'integer', 'min:0'],
                'revenue' => ['nullable', 'integer', 'min:0'],
                'channel_remarks' => ['nullable', 'string'],
            ]);

            $data['category'] = $data['entry_type'];
            $data['status'] = 'Active';

            if ($data['entry_type'] === 'online') {
                $data['channel_distribution'] = $data['platform'];
            } else {
                $data['channel_distribution'] = $data['channel'];
            }
        } else {
            $data = $request->validate([
                'sales_date' => ['sometimes', 'date'],
                'sku_name' => ['required', 'string', 'max:255'],
                'sku_code' => ['required', 'string', 'max:255'],
                'category' => ['required', 'string', 'max:255'],
                'status' => ['required', 'string', 'max:255'],
                'channel_distribution' => ['required', 'string', 'max:255'],
                'pricing_rsp_old' => ['nullable', 'integer', 'min:0'],
                'pricing_rsp_new' => ['nullable', 'integer', 'min:0'],
                'channel_remarks' => ['nullable', 'string'],
            ]);
        }

        $data['user_id'] = $user->id;
        $data['sales_date'] = isset($data['sales_date']) ? Carbon::parse($data['sales_date'])->toDateString() : now()->toDateString();

        $entry = SalesEntry::create($data);

        return response()->json($entry->load('user:id,name,email,role'), 201);
    }
}
