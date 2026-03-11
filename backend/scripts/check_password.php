<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$u = \App\Models\User::query()->where('email', 'admin@sales.local')->first();
if (! $u) { echo "NO_USER"; exit(1); }
echo \Illuminate\Support\Facades\Hash::check('password123', $u->password) ? "MATCH" : "NO_MATCH";
