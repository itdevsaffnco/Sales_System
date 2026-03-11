<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesJubelio extends Model
{
    protected $table = 'sales_jubelio';
    protected $fillable = [
        'doc_id',
        'doc_number',
        'contact_id',
        'customer_name',
        'ref_no',
        'transaction_date',
        'salesorder_id',
        'due_date',
        'is_opening_balance',
        'grand_total',
        'doc_type',
        'age',
        'age_due',
        'due',
        'last_modified',
        'salesman_name',
        'so_customer_name',
        'created_date',
        'store_name',
        'store_id',
        'downpayment_amount',
    ];
    protected $casts = [
        'transaction_date' => 'datetime',
        'due_date' => 'datetime',
        'last_modified' => 'datetime',
        'created_date' => 'datetime',
        'is_opening_balance' => 'boolean',
        'grand_total' => 'decimal:4',
        'due' => 'decimal:4',
        'downpayment_amount' => 'decimal:4',
    ];
}
