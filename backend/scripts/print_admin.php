<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$u = \App\Models\User::query()->where('email', 'admin@sales.local')->first();
echo $u ? json_encode($u->only(['id','name','email','role'])) : 'NOT_FOUND';
