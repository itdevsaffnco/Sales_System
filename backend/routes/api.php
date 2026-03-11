<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SalesEntryController;
use App\Http\Controllers\Api\ExternalAuthController;
use App\Http\Controllers\Api\JubelioController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::prefix('external-api')->group(function () {
    Route::post('/credentials', [ExternalAuthController::class, 'storeCredentials']);
    Route::post('/login', [ExternalAuthController::class, 'login']);
    Route::get('/token', [ExternalAuthController::class, 'getToken']);
    Route::post('/sales/sync', [JubelioController::class, 'syncSales']);
    Route::get('/sales', [JubelioController::class, 'listSales']);
    Route::get('/fetch', [JubelioController::class, 'fetch']);
});

Route::options('/{any}', function (\Illuminate\Http\Request $request) {
    $origin = $request->headers->get('Origin', '*');
    return response('', 204)
        ->header('Access-Control-Allow-Origin', $origin)
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/sales-entries', [SalesEntryController::class, 'index']);
    Route::post('/sales-entries', [SalesEntryController::class, 'store']);

    Route::get('/dashboard/general', [DashboardController::class, 'general']);
});
