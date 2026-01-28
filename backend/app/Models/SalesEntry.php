<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesEntry extends Model
{
    protected $fillable = [
        'user_id',
        'entry_type',
        'date_period',
        'platform',
        'channel',
        'account',
        'sales_date',
        'sku_name',
        'sku_code',
        'category',
        'status',
        'channel_distribution',
        'qty',
        'margin',
        'brand_disc',
        'brand_voucher',
        'member_discount',
        'revenue',
        'pricing_rsp_old',
        'pricing_rsp_new',
        'channel_remarks',
        'gmv_formula',
        'gmv_after_support_formula',
    ];

    protected $casts = [
        'sales_date' => 'date',
        'qty' => 'integer',
        'margin' => 'integer',
        'brand_disc' => 'integer',
        'brand_voucher' => 'integer',
        'member_discount' => 'integer',
        'revenue' => 'integer',
        'pricing_rsp_old' => 'integer',
        'pricing_rsp_new' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sku()
    {
        return $this->belongsTo(Sku::class, 'sku_code', 'sku_code');
    }

    public function platformData()
    {
        return $this->belongsTo(Platform::class, 'platform', 'name');
    }
}
