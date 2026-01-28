<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SalesEntryController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/sales-entries', [SalesEntryController::class, 'index']);
    Route::post('/sales-entries', [SalesEntryController::class, 'store']);

    Route::get('/dashboard/general', [DashboardController::class, 'general']);
});
