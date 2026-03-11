<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\Sku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        return view('settings_index');
    }

    public function channels(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $query = Platform::query()->orderBy('name');
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('type', 'like', "%{$q}%");
            });
        }
        $platforms = $query->get(['name', 'type', 'gmv_formula', 'gmv_after_support_formula'])
            ->map(fn ($p) => [
                'name' => $p->name,
                'type' => $p->type,
                'gmv_formula' => $p->gmv_formula,
                'gmv_after_support_formula' => $p->gmv_after_support_formula,
            ])->toArray();

        return view('settings_channels', [
            'platforms' => $platforms,
            'q' => $q,
        ]);
    }

    public function channelsAdd(Request $request)
    {
        $data = $request->validate([
            'platform_name' => ['required', 'string', 'max:255'],
            'platform_type' => ['required', 'in:online,offline'],
            'gmv_formula' => ['nullable', 'string'],
            'gmv_after_support_formula' => ['nullable', 'string'],
        ]);

        Platform::query()->updateOrCreate(
            ['name' => $data['platform_name']],
            [
                'type' => $data['platform_type'],
                'gmv_formula' => $data['gmv_formula'] ?? null,
                'gmv_after_support_formula' => $data['gmv_after_support_formula'] ?? null,
            ]
        );

        return redirect()->route('settings.channels')->with('status', 'Platform saved');
    }

    public function channelsDelete(Request $request)
    {
        $data = $request->validate([
            'platform_name' => ['required', 'string', 'max:255'],
        ]);

        Platform::query()->where('name', $data['platform_name'])->delete();

        return redirect()->route('settings.channels')->with('status', 'Platform deleted');
    }

    public function channelsDownload(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $query = Platform::query()->orderBy('name');
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('type', 'like', "%{$q}%");
            });
        }

        $rows = $query->get(['name', 'type', 'gmv_formula', 'gmv_after_support_formula']);

        $response = new StreamedResponse(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['name', 'type', 'gmv_formula', 'gmv_after_support_formula']);
            foreach ($rows as $r) {
                fputcsv($out, [$r->name, $r->type, $r->gmv_formula, $r->gmv_after_support_formula]);
            }
            fclose($out);
        });
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="platforms.csv"');
        return $response;
    }

    public function channelsSimulate(Request $request)
    {
        $data = $request->validate([
            'pricing_rsp_new' => ['nullable'],
            'qty' => ['nullable'],
            'margin' => ['nullable'],
            'brand_disc' => ['nullable'],
            'brand_voucher' => ['nullable'],
            'member' => ['nullable'],
            'gmv_after_support_formula' => ['nullable', 'string'],
        ]);

        $result = Platform::simulateGmv($data, null, $data['gmv_after_support_formula'] ?? null);
        return response()->json($result);
    }

    public function products(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $sort = (string) $request->query('sort', 'sku_code');
        $dir = strtolower((string) $request->query('direction', 'asc')) === 'desc' ? 'desc' : 'asc';

        $query = Sku::query();
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('sku_code', 'like', "%{$q}%")
                  ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        if (in_array($sort, ['sku_code','sku_name','ml','category','status','channel_distribution','price'], true)) {
            $query->orderBy($sort, $dir);
        } else {
            $query->orderBy('sku_code');
        }

        $skus = $query->limit(500)->get();

        $categories = Sku::query()->select('category')->distinct()->pluck('category')->filter()->values()->all();
        $statuses = ['Active', 'Inactive'];
        $channelGroups = Platform::query()->orderBy('name')->pluck('name')->values()->all();

        $editing = null;
        if ($code = $request->query('edit')) {
            $editing = Sku::query()->where('sku_code', $code)->first()?->toArray();
        }

        return view('settings_products', [
            'skus' => $skus,
            'categories' => $categories,
            'statuses' => $statuses,
            'channelGroups' => $channelGroups,
            'editing' => $editing,
            'q' => $q,
        ]);
    }

    public function productsCreate(Request $request)
    {
        $data = $request->validate([
            'sku_code' => ['required','string','max:255'],
            'sku_name' => ['required','string','max:255'],
            'ml' => ['nullable','string','max:50'],
            'category' => ['required','string','max:255'],
            'status' => ['required','string','max:50'],
            'channel_distribution' => ['required','string','max:255'],
            'price' => ['nullable','integer','min:0'],
        ]);

        Sku::query()->updateOrCreate(
            ['sku_code' => $data['sku_code']],
            $data
        );

        return redirect()->route('settings.products')->with('status', 'SKU saved');
    }

    public function productsDelete(Request $request)
    {
        $data = $request->validate([
            'sku_code' => ['required','string','max:255'],
        ]);

        Sku::query()->where('sku_code', $data['sku_code'])->delete();

        return redirect()->route('settings.products')->with('status', 'SKU deleted');
    }

    public function productsDownload(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $query = Sku::query()->orderBy('sku_code');
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('sku_code', 'like', "%{$q}%")
                  ->orWhere('sku_name', 'like', "%{$q}%");
            });
        }
        $rows = $query->get(['sku_code','sku_name','ml','category','status','channel_distribution','price']);

        $response = new StreamedResponse(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['sku_code','sku_name','ml','category','status','channel_distribution','price']);
            foreach ($rows as $r) {
                fputcsv($out, [$r->sku_code, $r->sku_name, $r->ml, $r->category, $r->status, $r->channel_distribution, $r->price]);
            }
            fclose($out);
        });
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="skus.csv"');
        return $response;
    }

    public function pricing(Request $request)
    {
        return view('settings_pricing');
    }

    public function pricingUpdate(Request $request)
    {
        $data = $request->validate([
            'sku_code' => ['nullable','string'],
            'sku_name' => ['nullable','string'],
            'price' => ['required','integer','min:0'],
        ]);

        $query = Sku::query();
        if (!empty($data['sku_code'])) {
            $query->where('sku_code', $data['sku_code']);
        } elseif (!empty($data['sku_name'])) {
            $query->where('sku_name', $data['sku_name']);
        } else {
            return redirect()->route('settings.pricing')->with('status', 'Isi SKU Code atau SKU Name');
        }

        $sku = $query->first();
        if (!$sku) {
            return redirect()->route('settings.pricing')->with('status', 'SKU tidak ditemukan');
        }
        $sku->price = $data['price'];
        $sku->save();

        return redirect()->route('settings.pricing')->with('status', 'Price updated');
    }
}
