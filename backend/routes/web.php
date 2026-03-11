<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SalesDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Redirect legacy login route to Frontend App
Route::get('/login', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:5173/login'));
})->name('login');

Route::middleware([])->group(function () {
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/settings/channels', [SettingsController::class, 'channels'])->name('settings.channels');
    Route::post('/settings/channels/add', [SettingsController::class, 'channelsAdd'])->name('settings.channels.add');
    Route::post('/settings/channels/delete', [SettingsController::class, 'channelsDelete'])->name('settings.channels.delete');
    Route::get('/settings/channels/download', [SettingsController::class, 'channelsDownload'])->name('settings.channels.download');
    Route::post('/settings/channels/simulate', [SettingsController::class, 'channelsSimulate'])->name('settings.channels.simulate');
    Route::post('/logout', function () {
        auth()->guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect()->route('login');
    })->name('logout');

    Route::get('/settings/account', function () {
        return view('settings_account');
    })->name('settings.account');
    Route::post('/settings/account/password', function () {
        return redirect()->route('settings.account')->with('status', 'Password changed');
    })->name('settings.account.password');

    Route::get('/settings/users', function () {
        return view('settings_users');
    })->name('settings.users');
    Route::post('/settings/users/create', function (\Illuminate\Http\Request $request) {
        return redirect()->route('settings.users')->with('status', 'User created');
    })->name('settings.users.create');

    Route::get('/settings/attributes', function () {
        return view('settings_attributes');
    })->name('settings.attributes');

    Route::get('/settings/products', [SettingsController::class, 'products'])->name('settings.products');
    Route::post('/settings/products/create', [SettingsController::class, 'productsCreate'])->name('settings.products.create');
    Route::post('/settings/products/delete', [SettingsController::class, 'productsDelete'])->name('settings.products.delete');
    Route::get('/settings/products/download', [SettingsController::class, 'productsDownload'])->name('settings.products.download');

    Route::get('/settings/pricing', [SettingsController::class, 'pricing'])->name('settings.pricing');
    Route::post('/settings/pricing/update', [SettingsController::class, 'pricingUpdate'])->name('settings.pricing.update');

    Route::get('/dashboard-sales', [SalesDashboardController::class, 'index'])->name('dashboard.sales');
    Route::get('/dashboard-sales/export', [SalesDashboardController::class, 'export'])->name('dashboard.sales.export');
    Route::delete('/dashboard-sales/entry/{id}', [SalesDashboardController::class, 'delete'])->name('dashboard.entry.delete');
});
