<?php

use App\Models\Platform;
use App\Models\SalesEntry;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return view('login');
})->name('login.form');

Route::post('/login', function () {
    $data = request()->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::query()->where('email', $data['email'])->first();
    if (! $user || ! Hash::check($data['password'], $user->password)) {
        return redirect('/login')->withInput()->with('error', 'Email atau password salah.');
    }

    request()->session()->put('user', [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
    ]);

    if ($user->role === 'sales_manager') {
        return redirect()->route('dashboard.sales');
    }

    return redirect()->route('sales.entry');
})->name('login.submit');

Route::post('/logout', function () {
    request()->session()->forget('user');
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/login');
})->name('logout');

Route::get('/sales-entry', function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    if (($sessionUser['role'] ?? null) !== 'sales_staff') {
        return redirect()->route('dashboard.sales');
    }

    $recentEntries = SalesEntry::with(['user', 'sku', 'platformData'])->where('user_id', $sessionUser['id'])
        ->orderByDesc('created_at')
        ->limit(5)
        ->get();

    $onlinePlatforms = Platform::where('type', 'online')->orderBy('name')->pluck('name')->toArray();
    if (empty($onlinePlatforms)) {
        $onlinePlatforms = [
            'SHOPEE',
            'TOKOPEDIA',
            'TIKTOK SELLER',
            'LAZADA',
            'BLIBLI',
            'ZALORA',
            'Website',
            'Whatsapp (Local)',
            'Whatsapp (Overseas)',
        ];
    }

    $offlinePlatforms = Platform::where('type', 'offline')->orderBy('name')->pluck('name')->toArray();
    if (empty($offlinePlatforms)) {
        $offlinePlatforms = [
            'Plaza Indonesia',
            'Mall Taman Anggrek',
            'Pop Up Event',
            'General Trade',
        ];
    }

    return view('sales_entry', [
        'channel' => request()->query('channel'),
        'recent_entries' => $recentEntries,
        'online_channels' => $onlinePlatforms,
        'offline_channels' => $offlinePlatforms,
    ]);
})->name('sales.entry');

Route::post('/sales-entry', function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    if (($sessionUser['role'] ?? null) !== 'sales_staff') {
        abort(403);
    }

    $type = request()->input('entry_type');

    $data = request()->validate([
        'entry_type' => ['required', 'in:online,offline'],
        'date_period' => ['required', 'string', 'max:50'],
        'platform' => ['required_if:entry_type,online', 'nullable', 'string', 'max:50'],
        'channel' => ['required_if:entry_type,offline', 'nullable', 'string', 'max:100'],
        'account' => ['nullable', 'string', 'max:150'],
        'sales_date' => ['sometimes', 'nullable', 'date'],
        'sku_name' => ['required', 'string', 'max:255'],
        'sku_code' => ['required', 'string', 'max:255'],
        'pricing_rsp_new' => ['required', 'integer', 'min:0'],
        'pricing_rsp_old' => ['nullable', 'integer', 'min:0'],
        'qty' => ['required', 'integer', 'min:0'],
        'margin' => ['nullable', 'integer', 'min:0'],
        'brand_disc' => ['nullable', 'integer', 'min:0'],
        'brand_voucher' => ['nullable', 'integer', 'min:0'],
        'revenue' => ['nullable', 'integer', 'min:0'],
        'channel_remarks' => ['nullable', 'string'],
    ]);

    $data['user_id'] = $sessionUser['id'];
    $salesDate = ! empty($data['sales_date']) ? Carbon::parse($data['sales_date']) : now();
    $data['sales_date'] = $salesDate->toDateString();
    $data['category'] = $type;
    $data['status'] = 'Active';
    $data['type_id'] = $type === 'online' ? 1 : 2;

    $periodYear = (int) request()->input('period_year');
    $periodMonth = (int) request()->input('period_month');
    $periodWeek = (int) request()->input('period_week');
    $data['year'] = $periodYear ?: (int) $salesDate->format('Y');
    $data['month'] = $periodMonth ?: (int) $salesDate->format('m');
    $data['week'] = $periodWeek ?: (int) $salesDate->weekOfMonth;

    $platformForFormula = null;
    $platformName = null;
    $platformId = null;

    if ($type === 'online') {
        $data['channel_distribution'] = $data['platform'];
        $platformName = $data['platform'] ?? null;
        if ($platformName) {
            $platformForFormula = Platform::where('name', $platformName)->first();
            if ($platformForFormula) {
                $platformId = $platformForFormula->id;
            }
        }
        $data['platform_id'] = $platformId;
    } else {
        $data['channel_distribution'] = $data['channel'];
        $platformName = $data['channel'] ?? null;
        if ($platformName) {
            $platformForFormula = Platform::where('name', $platformName)->first();
        }
        $data['platform_id'] = null;
    }

    $valuesForFormula = [
        'pricing_rsp_new' => (int) ($data['pricing_rsp_new'] ?? 0),
        'qty' => (int) ($data['qty'] ?? 0),
        'margin' => (int) ($data['margin'] ?? 0),
        'brand_disc' => (int) ($data['brand_disc'] ?? 0),
        'brand_voucher' => (int) ($data['brand_voucher'] ?? 0),
        'revenue' => (int) ($data['revenue'] ?? 0),
        'member' => 0,
    ];

    $gmvResult = Platform::calculateGmvForEntry($valuesForFormula, $platformForFormula);
    $data['gmv'] = $gmvResult['gmv'];
    $data['gmv_after_support'] = $gmvResult['gmv_after_support'];
    $data['gmv_formula'] = $gmvResult['gmv_formula'] ?? null;
    $data['gmv_after_support_formula'] = $gmvResult['gmv_after_support_formula'] ?? null;

    SalesEntry::create($data);

    return redirect()->route('sales.entry', array_filter(['channel' => request()->query('channel')]))->with('success', 'Entry berhasil disimpan.');
});

Route::get('/sales-entry/{id}/edit', function ($id) {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    $entry = SalesEntry::find($id);
    if (! $entry || $entry->user_id !== $sessionUser['id']) {
        abort(404);
    }

    $recentEntries = SalesEntry::with(['user', 'sku', 'platformData'])->where('user_id', $sessionUser['id'])
        ->orderByDesc('created_at')
        ->limit(5)
        ->get();

    $onlinePlatforms = Platform::where('type', 'online')->orderBy('name')->pluck('name')->toArray();
    if (empty($onlinePlatforms)) {
        $onlinePlatforms = [
            'SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)',
        ];
    }

    $offlinePlatforms = Platform::where('type', 'offline')->orderBy('name')->pluck('name')->toArray();
    if (empty($offlinePlatforms)) {
        $offlinePlatforms = [
            'Plaza Indonesia',
            'Mall Taman Anggrek',
            'Pop Up Event',
            'General Trade',
        ];
    }

    return view('sales_entry', [
        'entry' => $entry,
        'recent_entries' => $recentEntries,
        'channel' => null,
        'online_channels' => $onlinePlatforms,
        'offline_channels' => $offlinePlatforms,
    ]);
})->name('sales.entry.edit');

Route::put('/sales-entry/{id}', function ($id) {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    $entry = SalesEntry::find($id);
    if (! $entry || $entry->user_id !== $sessionUser['id']) {
        abort(404);
    }

    $data = request()->validate([
        'entry_type' => ['required', 'in:online,offline'],
        'date_period' => ['required', 'string', 'max:50'],
        'platform' => ['required_if:entry_type,online', 'nullable', 'string', 'max:50'],
        'channel' => ['required_if:entry_type,offline', 'nullable', 'string', 'max:100'],
        'account' => ['nullable', 'string', 'max:150'],
        'sales_date' => ['sometimes', 'nullable', 'date'],
        'sku_name' => ['required', 'string', 'max:255'],
        'sku_code' => ['required', 'string', 'max:255'],
        'pricing_rsp_new' => ['required', 'integer', 'min:0'],
        'pricing_rsp_old' => ['nullable', 'integer', 'min:0'],
        'qty' => ['required', 'integer', 'min:0'],
        'margin' => ['nullable', 'integer', 'min:0'],
        'brand_disc' => ['nullable', 'integer', 'min:0'],
        'brand_voucher' => ['nullable', 'integer', 'min:0'],
        'revenue' => ['nullable', 'integer', 'min:0'],
        'channel_remarks' => ['nullable', 'string'],
    ]);

    $salesDate = ! empty($data['sales_date']) ? Carbon::parse($data['sales_date']) : now();
    $data['sales_date'] = $salesDate->toDateString();
    $data['category'] = $data['entry_type'];
    $data['type_id'] = $data['entry_type'] === 'online' ? 1 : 2;

    $periodYear = (int) request()->input('period_year');
    $periodMonth = (int) request()->input('period_month');
    $periodWeek = (int) request()->input('period_week');
    $data['year'] = $periodYear ?: (int) $salesDate->format('Y');
    $data['month'] = $periodMonth ?: (int) $salesDate->format('m');
    $data['week'] = $periodWeek ?: (int) $salesDate->weekOfMonth;

    $platformForFormula = null;
    $platformName = null;
    $platformId = null;

    if ($data['entry_type'] === 'online') {
        $data['channel_distribution'] = $data['platform'];
        $platformName = $data['platform'] ?? null;
        if ($platformName) {
            $platformForFormula = Platform::where('name', $platformName)->first();
            if ($platformForFormula) {
                $platformId = $platformForFormula->id;
            }
        }
        $data['platform_id'] = $platformId;
    } else {
        $data['channel_distribution'] = $data['channel'];
        $platformName = $data['channel'] ?? null;
        if ($platformName) {
            $platformForFormula = Platform::where('name', $platformName)->first();
        }
        $data['platform_id'] = null;
    }

    $valuesForFormula = [
        'pricing_rsp_new' => (int) ($data['pricing_rsp_new'] ?? 0),
        'qty' => (int) ($data['qty'] ?? 0),
        'margin' => (int) ($data['margin'] ?? 0),
        'brand_disc' => (int) ($data['brand_disc'] ?? 0),
        'brand_voucher' => (int) ($data['brand_voucher'] ?? 0),
        'revenue' => (int) ($data['revenue'] ?? 0),
        'member' => 0,
    ];

    $gmvResult = Platform::calculateGmvForEntry($valuesForFormula, $platformForFormula);
    $data['gmv'] = $gmvResult['gmv'];
    $data['gmv_after_support'] = $gmvResult['gmv_after_support'];
    $data['gmv_formula'] = $gmvResult['gmv_formula'] ?? null;
    $data['gmv_after_support_formula'] = $gmvResult['gmv_after_support_formula'] ?? null;

    $entry->update($data);

    return redirect()->route('sales.entry')->with('success', 'Data berhasil diupdate.');
})->name('sales.entry.update');

Route::delete('/sales-entry/{id}', function ($id) {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    $entry = SalesEntry::find($id);
    if (! $entry || $entry->user_id !== $sessionUser['id']) {
        abort(404);
    }

    $entry->delete();

    return redirect()->route('sales.entry')->with('success', 'Data berhasil dihapus.');
})->name('sales.entry.delete');

Route::get('/sku-lookup', function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $skuCode = trim((string) request()->query('sku_code', ''));
    $skuName = trim((string) request()->query('sku_name', ''));

    if ($skuCode === '' && $skuName === '') {
        return response()->json(['message' => 'Query kosong'], 422);
    }

    $query = Sku::query();

    if ($skuCode !== '') {
        $query->where('sku_code', $skuCode);
    }

    if ($skuName !== '') {
        $query->where('sku_name', $skuName);
    }

    $sku = $query->first();

    if (! $sku && $skuCode !== '') {
        $sku = Sku::where('sku_code', 'like', $skuCode.'%')->orderBy('sku_code')->first();
    }

    if (! $sku && $skuName !== '') {
        $sku = Sku::where('sku_name', 'like', '%'.$skuName.'%')->orderBy('sku_name')->first();
    }

    if (! $sku) {
        return response()->json(['message' => 'SKU tidak ditemukan'], 404);
    }

    return response()->json([
        'sku_code' => $sku->sku_code,
        'sku_name' => $sku->sku_name,
        'price' => $sku->price,
    ]);
})->name('sku.lookup');

Route::get('/sku-search', function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return response()->json([], 200);
    }

    $q = trim((string) request()->query('q', ''));
    if ($q === '') {
        return response()->json([], 200);
    }

    $like = '%'.$q.'%';

    $skus = Sku::query()
        ->where(function ($sub) use ($like) {
            $sub->where('sku_name', 'like', $like)
                ->orWhere('sku_code', 'like', $like);
        })
        ->orderBy('sku_name')
        ->limit(10)
        ->get(['sku_code', 'sku_name', 'price']);

    return response()->json($skus);
})->name('sku.search');

$uploadSalesEntry = function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }
    if (($sessionUser['role'] ?? null) !== 'sales_staff') {
        abort(403);
    }

    request()->validate([
        'file' => ['required', 'file', 'mimes:csv,txt'],
    ]);

    $file = request()->file('file');
    $path = $file->getRealPath();
    $handle = fopen($path, 'r');
    if (! $handle) {
        return redirect()->route('sales.entry')->with('error', 'File tidak bisa dibaca.');
    }

    $header = fgetcsv($handle);
    $created = 0;
    while (($row = fgetcsv($handle)) !== false) {
        $data = array_combine($header, $row);
        if (!is_array($data)) {
            continue;
        }
        $entry = [
            'user_id' => $sessionUser['id'],
            'sales_date' => !empty($data['sales_date']) ? Carbon::parse($data['sales_date'])->toDateString() : now()->toDateString(),
            'entry_type' => 'online',
            'date_period' => $data['date_period'] ?? now()->format('Y-m') . ' Week 1',
            'platform' => $data['channel'] ?? $data['platform'] ?? null,
            'channel' => $data['channel'] ?? null,
            'account' => $data['account'] ?? null,
            'sku_name' => $data['sku_name'] ?? '',
            'sku_code' => $data['sku_code'] ?? '',
            'pricing_rsp_new' => (int) ($data['pricing_rsp_new'] ?? 0),
            'pricing_rsp_old' => (int) ($data['pricing_rsp_old'] ?? 0),
            'qty' => (int) ($data['qty'] ?? 0),
            'margin' => (int) ($data['margin'] ?? 0),
            'brand_disc' => (int) ($data['brand_disc'] ?? 0),
            'brand_voucher' => (int) ($data['brand_voucher'] ?? 0),
            'revenue' => (int) ($data['revenue'] ?? 0),
            'channel_remarks' => $data['channel_remarks'] ?? null,
            'status' => 'Active',
        ];
        $entry['category'] = $entry['channel'] ? 'offline' : 'online';
        $entry['type_id'] = $entry['channel'] ? 2 : 1;
        $entry['channel_distribution'] = $entry['platform'] ?: ($entry['channel'] ?: 'Unknown');

        $salesDate = Carbon::parse($entry['sales_date']);
        $entry['year'] = (int) $salesDate->format('Y');
        $entry['month'] = (int) $salesDate->format('m');

        $period = $entry['date_period'] ?? '';
        $weekNumber = null;
        if (preg_match('/Week\s+(\d+)/i', $period, $matches)) {
            $weekNumber = (int) $matches[1];
        }
        $entry['week'] = $weekNumber ?: (int) $salesDate->weekOfMonth;

        $platformName = $entry['platform'] ?: ($entry['channel'] ?: null);
        $platformForFormula = null;
        $platformId = null;
        if ($platformName) {
            $platformForFormula = Platform::where('name', $platformName)->first();
            if ($platformForFormula) {
                $platformId = $platformForFormula->id;
            }
        }
        $entry['platform_id'] = $platformId;

        $valuesForFormula = [
            'pricing_rsp_new' => (int) ($entry['pricing_rsp_new'] ?? 0),
            'qty' => (int) ($entry['qty'] ?? 0),
            'margin' => (int) ($entry['margin'] ?? 0),
            'brand_disc' => (int) ($entry['brand_disc'] ?? 0),
            'brand_voucher' => (int) ($entry['brand_voucher'] ?? 0),
            'revenue' => (int) ($entry['revenue'] ?? 0),
            'member' => 0,
        ];

        $gmvResult = Platform::calculateGmvForEntry($valuesForFormula, $platformForFormula);
        $entry['gmv'] = $gmvResult['gmv'];
        $entry['gmv_after_support'] = $gmvResult['gmv_after_support'];
        $entry['gmv_formula'] = $gmvResult['gmv_formula'] ?? null;
        $entry['gmv_after_support_formula'] = $gmvResult['gmv_after_support_formula'] ?? null;

        if ($entry['sku_code'] && $entry['sku_name']) {
            SalesEntry::create($entry);
            $created++;
        }
    }
    fclose($handle);

    return redirect()->route('sales.entry')->with('success', 'Upload selesai. '.$created.' baris ditambahkan.');
};
Route::post('/sales-entry/upload', $uploadSalesEntry)->name('sales.entry.upload');

$dashboardSalesHandler = function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    if (($sessionUser['role'] ?? null) === 'sales_staff') {
        return redirect()->route('sales.entry');
    }

    $selectedChannel = request()->query('channel');
    $search = trim((string) request()->query('q'));
    // Build online channels list from DB (fallback to defaults)
    $onlineChannels = Platform::where('type', 'online')->orderBy('name')->pluck('name')->toArray();
    if (empty($onlineChannels)) {
        $onlineChannels = [
            'SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)',
        ];
    }
    $selectedType = null;
    if ($selectedChannel) {
        $selectedType = in_array($selectedChannel, $onlineChannels, true) ? 'online' : 'offline';
    }

    $baseQuery = SalesEntry::query()
        ->whereDoesntHave('user', function ($query) {
            $query->where('role', 'sales_manager');
        });

    if ($selectedChannel) {
        $baseQuery->where('channel_distribution', $selectedChannel);
    }
    if ($search !== '') {
        $baseQuery->where(function ($q) use ($search) {
            $like = '%'.$search.'%';
            $q->where('sku_code', 'like', $like)
                ->orWhere('sku_name', 'like', $like)
                ->orWhere('channel_distribution', 'like', $like)
                ->orWhere('account', 'like', $like);
        });
    }

    $totalEntries = (clone $baseQuery)->count();
    $totalSales = (clone $baseQuery)
        ->selectRaw('COALESCE(SUM(pricing_rsp_new * qty), 0) as total_sales')
        ->value('total_sales');
    $totalSales = (int) ($totalSales ?? 0);
    $avgOrderValue = $totalEntries > 0 ? (int) round($totalSales / $totalEntries) : 0;
    $activeChannels = (clone $baseQuery)->distinct('channel_distribution')->count('channel_distribution');

    if ($selectedChannel) {
        $topChannel = (object) [
            'channel_distribution' => $selectedChannel,
            'entries_count' => $totalEntries,
        ];
    } else {
        $topChannel = (clone $baseQuery)->selectRaw('channel_distribution, COUNT(*) as entries_count')
            ->groupBy('channel_distribution')
            ->orderByDesc('entries_count')
            ->first();
    }

    $recentEntries = (clone $baseQuery)->with(['user', 'sku', 'platformData'])
        ->orderByDesc('sales_date')
        ->orderByDesc('id')
        ->limit(10)
        ->get();

    return view('sales_dashboard', [
        'total_entries' => $totalEntries,
        'total_sales' => $totalSales,
        'avg_order_value' => $avgOrderValue,
        'active_channels' => $activeChannels,
        'top_channel' => $topChannel,
        'recent_entries' => $recentEntries,
        'selected_channel' => $selectedChannel,
        'selected_type' => $selectedType,
        'search_query' => $search,
    ]);
};

Route::get('/dashboard-sales', $dashboardSalesHandler)->name('dashboard.sales');

Route::get('/dashboard-sales/export', function () {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    if (($sessionUser['role'] ?? null) === 'sales_staff') {
        return redirect()->route('sales.entry');
    }

    $selectedChannel = request()->query('channel');
    $search = trim((string) request()->query('q'));

    $baseQuery = SalesEntry::query()
        ->whereDoesntHave('user', function ($query) {
            $query->where('role', 'sales_manager');
        })
        ->with('user');

    if ($selectedChannel) {
        $baseQuery->where('channel_distribution', $selectedChannel);
    }
    if ($search !== '') {
        $baseQuery->where(function ($q) use ($search) {
            $like = '%'.$search.'%';
            $q->where('sku_code', 'like', $like)
                ->orWhere('sku_name', 'like', $like)
                ->orWhere('channel_distribution', 'like', $like)
                ->orWhere('account', 'like', $like);
        });
    }

    $filename = 'sales-entries';
    if ($selectedChannel) {
        $filename .= '-'.preg_replace('/[^A-Za-z0-9_-]+/', '-', $selectedChannel);
    }
    $filename .= '-'.now()->format('Y-m-d_His').'.csv';

    return response()->streamDownload(function () use ($baseQuery) {
        $out = fopen('php://output', 'w');

        fputcsv($out, [
            'sales_date',
            'account',
            'channel',
            'sku_code',
            'sku_name',
            'qty',
            'pricing_rsp_new',
            'pricing_rsp_old',
            'margin',
            'brand_disc',
            'brand_voucher',
            'revenue',
            'created_at',
        ]);

        (clone $baseQuery)
            ->orderBy('sales_date')
            ->orderBy('id')
            ->chunk(1000, function ($entries) use ($out) {
                foreach ($entries as $entry) {
                    fputcsv($out, [
                        optional($entry->sales_date)->format('Y-m-d') ?? (string) $entry->sales_date,
                        optional($entry->user)->name ?? 'Sales Staff',
                        $entry->channel_distribution,
                        $entry->sku_code,
                        $entry->sku_name,
                        $entry->qty,
                        $entry->pricing_rsp_new,
                        $entry->pricing_rsp_old,
                        $entry->margin,
                        $entry->brand_disc,
                        $entry->brand_voucher,
                        $entry->revenue,
                        optional($entry->created_at)->format('Y-m-d H:i:s') ?? (string) $entry->created_at,
                    ]);
                }
            });

        fclose($out);
    }, $filename, [
        'Content-Type' => 'text/csv; charset=UTF-8',
    ]);
})->name('dashboard.sales.export');

Route::get('/dashboard-demo', function () {
    return redirect()->route('dashboard.sales', array_filter([
        'channel' => request()->query('channel'),
    ]));
});

$deleteDashboardSalesEntry = function ($id) {
    $sessionUser = request()->session()->get('user');
    if (! $sessionUser) {
        return redirect('/login');
    }

    if (($sessionUser['role'] ?? null) !== 'sales_manager') {
        abort(403);
    }

    $entry = SalesEntry::find($id);
    if (! $entry) {
        abort(404);
    }

    $entry->delete();

    return redirect()->route('dashboard.sales', array_filter([
        'channel' => request()->query('channel'),
    ]))->with('success', 'Data berhasil dihapus.');
};

Route::delete('/dashboard-sales/sales-entry/{id}', $deleteDashboardSalesEntry)->name('dashboard.entry.delete');

Route::delete('/dashboard-demo/sales-entry/{id}', $deleteDashboardSalesEntry);

Route::middleware([])->group(function () {
    Route::get('/settings', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            return redirect()->route('sales.entry');
        }
        return view('settings_index');
    })->name('settings.index');

    Route::get('/settings/account', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        return view('settings_account');
    })->name('settings.account');

    Route::post('/settings/account/password', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        $data = request()->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8'],
        ]);
        $user = User::find($sessionUser['id']);
        if (! $user || ! Hash::check($data['current_password'], $user->password)) {
            return back()->with('error', 'Password saat ini salah.');
        }
        $user->password = Hash::make($data['new_password']);
        $user->save();
        return back()->with('success', 'Password berhasil diubah.');
    })->name('settings.account.password');

    Route::get('/settings/users', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $users = User::orderBy('id', 'desc')->limit(50)->get();
        return view('settings_users', ['users' => $users]);
    })->name('settings.users');

    Route::post('/settings/users/create', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:sales_staff,sales_manager'],
        ]);
        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
        return redirect()->route('settings.users')->with('success', 'Akun berhasil dibuat.');
    })->name('settings.users.create');

        Route::get('/settings/attributes', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $categories = \App\Models\AttributeOption::where('type', 'category')->orderBy('value')->get();
        $statuses = \App\Models\AttributeOption::where('type', 'status')->orderBy('value')->get();
        $channels = \App\Models\AttributeOption::where('type', 'channel_distribution')->orderBy('value')->get();
        
        return view('settings_attributes', [
            'categories' => $categories,
            'statuses' => $statuses,
            'channels' => $channels,
        ]);
    })->name('settings.attributes');

    Route::post('/settings/attributes/add', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $data = request()->validate([
            'type' => ['required', 'in:category,status,channel_distribution'],
            'value' => ['required', 'string', 'max:255'],
        ]);
        
        \App\Models\AttributeOption::create([
            'type' => $data['type'],
            'value' => $data['value'],
        ]);
        
        return redirect()->route('settings.attributes')->with('success', 'Item added.');
    })->name('settings.attributes.add');

    Route::post('/settings/attributes/delete', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $data = request()->validate([
            'id' => ['required', 'exists:attribute_options,id'],
        ]);
        
        \App\Models\AttributeOption::destroy($data['id']);
        
        return redirect()->route('settings.attributes')->with('success', 'Item deleted.');
    })->name('settings.attributes.delete');

    Route::get('/settings/channels', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $q = trim((string) request()->query('q', ''));
        $query = Platform::query();
        
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('type', 'like', "%{$q}%");
            });
        }
        
        $platforms = $query->orderBy('name')->get();
        return view('settings_channels', ['platforms' => $platforms, 'q' => $q]);
    })->name('settings.channels');

    Route::post('/settings/channels/add', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'platform_name' => ['required', 'string', 'max:100'],
            'platform_type' => ['required', 'in:online,offline'],
            'gmv_formula' => ['nullable', 'string', 'max:500'],
            'gmv_after_support_formula' => ['nullable', 'string', 'max:500'],
        ]);
        
        Platform::updateOrCreate(
            ['name' => $data['platform_name']],
            [
                'type' => $data['platform_type'],
                'gmv_formula' => $data['gmv_formula'] !== '' ? $data['gmv_formula'] : null,
                'gmv_after_support_formula' => $data['gmv_after_support_formula'] !== '' ? $data['gmv_after_support_formula'] : null,
            ]
        );

        return redirect()->route('settings.channels')->with('success', 'Platform disimpan.');
    })->name('settings.channels.add');

    Route::post('/settings/channels/delete', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'platform_name' => ['required', 'string', 'max:100'],
        ]);
        
        Platform::where('name', $data['platform_name'])->delete();
        
        return redirect()->route('settings.channels')->with('success', 'Platform dihapus.');
    })->name('settings.channels.delete');

    Route::post('/settings/channels/simulate-formula', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $data = request()->validate([
            'gmv_formula' => ['nullable', 'string', 'max:500'],
            'gmv_after_support_formula' => ['nullable', 'string', 'max:500'],
            'pricing_rsp_new' => ['nullable', 'numeric', 'min:0'],
            'qty' => ['nullable', 'numeric', 'min:0'],
            'margin' => ['nullable', 'numeric', 'min:0'],
            'brand_disc' => ['nullable', 'numeric', 'min:0'],
            'brand_voucher' => ['nullable', 'numeric', 'min:0'],
            'revenue' => ['nullable', 'numeric', 'min:0'],
            'member' => ['nullable', 'numeric', 'min:0'],
        ]);
        $values = [
            'pricing_rsp_new' => (float) ($data['pricing_rsp_new'] ?? 0),
            'qty' => (float) ($data['qty'] ?? 0),
            'margin' => (float) ($data['margin'] ?? 0),
            'brand_disc' => (float) ($data['brand_disc'] ?? 0),
            'brand_voucher' => (float) ($data['brand_voucher'] ?? 0),
            'revenue' => (float) ($data['revenue'] ?? 0),
            'member' => (float) ($data['member'] ?? 0),
        ];
        $result = Platform::simulateGmv($values, $data['gmv_formula'] ?? null, $data['gmv_after_support_formula'] ?? null);
        return response()->json([
            'gmv' => $result['gmv'],
            'gmv_after_support' => $result['gmv_after_support'],
        ]);
    })->name('settings.channels.simulate');

    Route::get('/settings/channels/download', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $q = trim((string) request()->query('q', ''));
        $query = Platform::query();
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('type', 'like', "%{$q}%");
            });
        }
        $platforms = $query->orderBy('name')->get();

        return response()->streamDownload(function () use ($platforms) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['platform_name', 'platform_type']);
            foreach ($platforms as $p) {
                fputcsv($out, [$p->name, $p->type]);
            }
            fclose($out);
        }, 'platforms-'.now()->format('Ymd_His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    })->name('settings.channels.download');

    Route::get('/settings/products', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        if (\App\Models\Sku::query()->count() === 0) {
            $sheetUrl = env('SKU_SHEETS_URL');
            $sheetName = env('SKU_SHEETS_SHEET_NAME', 'Sheet1');
            if ($sheetUrl) {
                $id = null;
                $gid = null;
                if (preg_match('#/spreadsheets/d/([a-zA-Z0-9-_]+)#', $sheetUrl, $m)) {
                    $id = $m[1];
                }
                if (preg_match('#[?&]gid=([0-9]+)#', $sheetUrl, $m)) {
                    $gid = $m[1];
                }
                if ($id) {
                    $csvUrl = $gid ? "https://docs.google.com/spreadsheets/d/{$id}/export?format=csv&gid={$gid}" : "https://docs.google.com/spreadsheets/d/{$id}/gviz/tq?tqx=out:csv&sheet=".urlencode($sheetName);
                    $resp = Http::get($csvUrl);
                    if ($resp->ok()) {
                        $content = $resp->body();
                        $stream = fopen('php://temp', 'r+');
                        fwrite($stream, $content);
                        rewind($stream);
                        $header = fgetcsv($stream);
                        if (is_array($header) && !empty($header)) {
                            $norm = function ($s) {
                                return strtolower(preg_replace('/[^a-z0-9]+/', ' ', trim((string)$s)));
                            };
                            $syn = [
                                'sku_code' => ['sku code', 'code'],
                                'sku_name' => ['sku name', 'name'],
                                'ml' => ['ml', 'volume'],
                                'category' => ['category'],
                                'status' => ['status'],
                                'channel_distribution' => ['channel distribution', 'channel', 'channel group'],
                                'price' => ['price', 'pricing', 'pricing rsp', 'rsp', 'pricing (rsp)'],
                            ];
                            $idx = [];
                            foreach ($header as $i => $col) {
                                $n = $norm($col);
                                foreach ($syn as $key => $cands) {
                                    foreach ($cands as $cand) {
                                        if ($n === $cand) {
                                            $idx[$key] = $i;
                                        }
                                    }
                                }
                            }
                            while (($row = fgetcsv($stream)) !== false) {
                                $code = isset($idx['sku_code']) ? trim((string) ($row[$idx['sku_code']] ?? '')) : '';
                                $name = isset($idx['sku_name']) ? trim((string) ($row[$idx['sku_name']] ?? '')) : '';
                                if ($code === '' && $name === '') {
                                    continue;
                                }
                                if ($code === '') {
                                    $existing = \App\Models\Sku::where('sku_name', $name)->first();
                                    $code = $existing?->sku_code ?? $name;
                                }
                                $ml = isset($idx['ml']) ? trim((string) ($row[$idx['ml']] ?? '')) : null;
                                $category = isset($idx['category']) ? trim((string) ($row[$idx['category']] ?? '')) : null;
                                $status = isset($idx['status']) ? trim((string) ($row[$idx['status']] ?? '')) : null;
                                $channel = isset($idx['channel_distribution']) ? trim((string) ($row[$idx['channel_distribution']] ?? '')) : null;
                                $priceVal = isset($idx['price']) ? (int) preg_replace('/[^0-9]/', '', (string) ($row[$idx['price']] ?? '0')) : 0;
                                \App\Models\Sku::updateOrCreate(
                                    ['sku_code' => $code],
                                    [
                                        'sku_name' => $name,
                                        'ml' => $ml ?: null,
                                        'category' => $category ?: null,
                                        'status' => $status ?: null,
                                        'channel_distribution' => $channel ?: null,
                                        'price' => $priceVal,
                                    ]
                                );
                            }
                            fclose($stream);
                        }
                    }
                }
            }
        }
        
        $q = trim((string) request()->query('q', ''));
        $sort = request()->query('sort', 'sku_code');
        $direction = request()->query('direction', 'asc');
        
        $query = Sku::query();
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('sku_code', 'like', "%{$q}%")
                    ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        
        $allowedSorts = ['sku_code', 'sku_name', 'ml', 'category', 'status', 'channel_distribution', 'price'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('sku_code', 'asc');
        }

        $skus = $query->get();
        
        $categories = \App\Models\AttributeOption::where('type', 'category')->orderBy('value')->pluck('value');
        $statuses = \App\Models\AttributeOption::where('type', 'status')->orderBy('value')->pluck('value');
        $channelGroups = \App\Models\AttributeOption::where('type', 'channel_distribution')->orderBy('value')->pluck('value');
        
        $editCode = request()->query('edit');
        $editing = $editCode ? Sku::find($editCode) : null;
        
        return view('settings_products', [
            'skus' => $skus,
            'q' => $q,
            'categories' => $categories,
            'statuses' => $statuses,
            'channelGroups' => $channelGroups,
            'editing' => $editing,
        ]);
    })->name('settings.products');

    Route::post('/settings/products/create', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'sku_code' => ['required', 'string', 'max:255'],
            'sku_name' => ['required', 'string', 'max:255'],
            'ml' => ['nullable', 'string', 'max:50'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],
            'channel_distribution' => ['nullable', 'string', 'max:100'],
            'price' => ['nullable', 'integer', 'min:0'],
        ]);
        
        $existing = Sku::find($data['sku_code']);
        
        Sku::updateOrCreate(
            ['sku_code' => $data['sku_code']],
            [
                'sku_name' => $data['sku_name'],
                'ml' => $data['ml'] ?? ($existing->ml ?? null),
                'category' => $data['category'] ?? ($existing->category ?? null),
                'status' => $data['status'] ?? ($existing->status ?? null),
                'channel_distribution' => $data['channel_distribution'] ?? ($existing->channel_distribution ?? null),
                'price' => array_key_exists('price', $data) ? (int) $data['price'] : ($existing->price ?? 0),
            ]
        );
        
        return redirect()->route('settings.products')->with('success', $existing ? 'SKU diupdate.' : 'SKU ditambahkan.');
    })->name('settings.products.create');
    
    Route::post('/settings/products/delete', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'sku_code' => ['required', 'string', 'max:255'],
        ]);
        
        Sku::destroy($data['sku_code']);
        
        return redirect()->route('settings.products')->with('success', 'SKU dihapus.');
    })->name('settings.products.delete');

    Route::get('/settings/pricing', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $q = trim((string) request()->query('q', ''));
        $query = Sku::query();
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('sku_code', 'like', "%{$q}%")
                    ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        $skus = $query->orderBy('sku_code')->get();
        
        return view('settings_pricing', ['skus' => $skus, 'q' => $q]);
    })->name('settings.pricing');

    Route::post('/settings/pricing/update', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'sku_code' => ['nullable', 'string', 'max:255'],
            'sku_name' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
        ]);
        
        $updated = false;
        if (!empty($data['sku_code'])) {
            $sku = Sku::find($data['sku_code']);
            if ($sku) {
                $sku->price = (int) $data['price'];
                $sku->save();
                $updated = true;
            }
        } elseif (!empty($data['sku_name'])) {
            $sku = Sku::where('sku_name', $data['sku_name'])->first();
            if ($sku) {
                $sku->price = (int) $data['price'];
                $sku->save();
                $updated = true;
            }
        }
        
        return redirect()->route('settings.pricing')->with($updated ? 'success' : 'error', $updated ? 'Harga berhasil diupdate.' : 'SKU tidak ditemukan.');
    })->name('settings.pricing.update');
    
    Route::post('/settings/pricing/import', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'sheet_url' => ['required', 'string'],
            'sheet' => ['nullable', 'string'],
        ]);
        $url = (string) $data['sheet_url'];
        $sheet = trim((string) ($data['sheet'] ?? 'Sheet1'));
        $id = null;
        $gid = null;
        if (preg_match('#/spreadsheets/d/([a-zA-Z0-9-_]+)#', $url, $m)) {
            $id = $m[1];
        }
        if (preg_match('#[?&]gid=([0-9]+)#', $url, $m)) {
            $gid = $m[1];
        }
        if (!$id) {
            return redirect()->route('settings.pricing')->with('error', 'Link Google Sheets tidak valid.');
        }
        $csvUrl = $gid ? "https://docs.google.com/spreadsheets/d/{$id}/export?format=csv&gid={$gid}" : "https://docs.google.com/spreadsheets/d/{$id}/gviz/tq?tqx=out:csv&sheet=".urlencode($sheet);
        $resp = Http::get($csvUrl);
        if (!$resp->ok()) {
            return redirect()->route('settings.pricing')->with('error', 'Gagal mengambil data dari Google Sheets.');
        }
        $content = $resp->body();
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $content);
        rewind($stream);
        $header = fgetcsv($stream);
        if (!is_array($header) || empty($header)) {
            fclose($stream);
            return redirect()->route('settings.pricing')->with('error', 'Header CSV tidak ditemukan.');
        }
        $norm = function ($s) {
            return strtolower(preg_replace('/[^a-z0-9]+/', ' ', trim((string)$s)));
        };
        $syn = [
            'sku_code' => ['sku code', 'code'],
            'sku_name' => ['sku name', 'name'],
            'ml' => ['ml', 'volume'],
            'category' => ['category'],
            'status' => ['status'],
            'channel_distribution' => ['channel distribution', 'channel', 'channel group'],
            'price' => ['price', 'pricing', 'pricing rsp', 'rsp', 'pricing (rsp)'],
        ];
        $idx = [];
        foreach ($header as $i => $col) {
            $n = $norm($col);
            foreach ($syn as $key => $cands) {
                foreach ($cands as $cand) {
                    if ($n === $cand) {
                        $idx[$key] = $i;
                    }
                }
            }
        }
        $imported = 0;
        while (($row = fgetcsv($stream)) !== false) {
            $code = isset($idx['sku_code']) ? trim((string) ($row[$idx['sku_code']] ?? '')) : '';
            $name = isset($idx['sku_name']) ? trim((string) ($row[$idx['sku_name']] ?? '')) : '';
            if ($code === '' && $name === '') {
                continue;
            }
            if ($code === '') {
                $existing = Sku::where('sku_name', $name)->first();
                $code = $existing?->sku_code ?? $name;
            }
            $ml = isset($idx['ml']) ? trim((string) ($row[$idx['ml']] ?? '')) : null;
            $category = isset($idx['category']) ? trim((string) ($row[$idx['category']] ?? '')) : null;
            $status = isset($idx['status']) ? trim((string) ($row[$idx['status']] ?? '')) : null;
            $channel = isset($idx['channel_distribution']) ? trim((string) ($row[$idx['channel_distribution']] ?? '')) : null;
            $priceVal = isset($idx['price']) ? (int) preg_replace('/[^0-9]/', '', (string) ($row[$idx['price']] ?? '0')) : 0;
            Sku::updateOrCreate(
                ['sku_code' => $code],
                [
                    'sku_name' => $name,
                    'ml' => $ml ?: null,
                    'category' => $category ?: null,
                    'status' => $status ?: null,
                    'channel_distribution' => $channel ?: null,
                    'price' => $priceVal,
                ]
            );
            $imported++;
        }
        fclose($stream);
        return redirect()->route('settings.pricing')->with('success', 'Import selesai. '.$imported.' baris diproses.');
    })->name('settings.pricing.import');

    Route::get('/settings/products/download', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $q = trim((string) request()->query('q', ''));
        $query = Sku::query();
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('sku_code', 'like', "%{$q}%")
                    ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        $skus = $query->orderBy('sku_code')->get();

        return response()->streamDownload(function () use ($skus) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['code', 'name', 'ml', 'category', 'status', 'channel_distribution', 'price']);
            foreach ($skus as $sku) {
                fputcsv($out, [
                    $sku->sku_code,
                    $sku->sku_name,
                    $sku->ml,
                    $sku->category,
                    $sku->status,
                    $sku->channel_distribution,
                    (int) $sku->price
                ]);
            }
            fclose($out);
        }, 'products-'.now()->format('Ymd_His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    })->name('settings.products.download');

    Route::get('/settings/pricing/download', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        
        $q = trim((string) request()->query('q', ''));
        $query = Sku::query();
        if ($q !== '') {
            $query->where(function($sub) use ($q) {
                $sub->where('sku_code', 'like', "%{$q}%")
                    ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        $skus = $query->orderBy('sku_code')->get();

        return response()->streamDownload(function () use ($skus) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['code', 'name', 'price']);
            foreach ($skus as $sku) {
                fputcsv($out, [$sku->sku_code, $sku->sku_name, (int) $sku->price]);
            }
            fclose($out);
        }, 'pricing-'.now()->format('Ymd_His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    })->name('settings.pricing.download');

    Route::post('/settings/users/delete', function () {
        $sessionUser = request()->session()->get('user');
        if (! $sessionUser) {
            return redirect('/login');
        }
        if (($sessionUser['role'] ?? null) !== 'sales_manager') {
            abort(403);
        }
        $data = request()->validate([
            'id' => ['required', 'integer', 'exists:users,id'],
        ]);
        if ((int) $data['id'] === (int) $sessionUser['id']) {
            return redirect()->route('settings.users')->with('error', 'Tidak bisa menghapus akun sendiri.');
        }
        $user = User::find($data['id']);
        if ($user) {
            $user->delete();
        }
        return redirect()->route('settings.users')->with('success', 'User berhasil dihapus.');
    })->name('settings.users.delete');
});
