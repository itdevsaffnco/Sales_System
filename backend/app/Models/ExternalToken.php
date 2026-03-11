<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExternalToken extends Model
{
    protected $fillable = [
        'provider',
        'endpoint',
        'email',
        'password_encrypted',
        'password_mask',
        'token',
        'expires_at',
        'last_fetched_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_fetched_at' => 'datetime',
    ];
}
