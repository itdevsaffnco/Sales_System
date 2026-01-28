<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sku extends Model
{
    protected $table = 'skus';

    protected $primaryKey = 'sku_code';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'sku_code',
        'sku_name',
        'ml',
        'category',
        'status',
        'channel_distribution',
        'price',
    ];
}

