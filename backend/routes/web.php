<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public restaurant pages (customer-facing)
Route::get('/r/{slug}', [PublicController::class, 'restaurantPage'])->name('public.restaurant');
Route::get('/scan/{qrToken}', [PublicController::class, 'scanQr'])->name('public.scan');
Route::post('/public/order', [PublicController::class, 'placeOrder'])->name('public.order');
Route::post('/public/payment', [PublicController::class, 'processPayment'])->name('public.payment');
Route::get('/public/session/{sessionId}', [PublicController::class, 'sessionStatus'])->name('public.session');

// Redirect root to admin login
Route::get('/', function () {
    return redirect()->route('admin.login');
});

// Admin auth (login only, no registration)
Route::get('/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/login', [AuthController::class, 'login'])->name('admin.login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Admin dashboard (super_admin only)
Route::middleware(['auth', 'super_admin'])->group(function () {
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('admin.dashboard');

    // Restaurants CRUD (no create/store - restaurants register themselves)
    Route::resource('restaurants', \App\Http\Controllers\Admin\RestaurantController::class)
        ->except(['create', 'store'])
        ->names('admin.restaurants');
    Route::post('/restaurants/{restaurant}/toggle-status', [\App\Http\Controllers\Admin\RestaurantController::class, 'toggleStatus'])
        ->name('admin.restaurants.toggleStatus');

    // Plans CRUD
    Route::resource('plans', \App\Http\Controllers\Admin\PlanController::class)
        ->names('admin.plans');

    // Subscriptions
    Route::get('/subscriptions', [\App\Http\Controllers\Admin\SubscriptionController::class, 'index'])
        ->name('admin.subscriptions.index');
    Route::post('/subscriptions/{restaurant}/assign', [\App\Http\Controllers\Admin\SubscriptionController::class, 'assign'])
        ->name('admin.subscriptions.assign');
    Route::post('/subscriptions/{restaurant}/extend', [\App\Http\Controllers\Admin\SubscriptionController::class, 'extend'])
        ->name('admin.subscriptions.extend');
    Route::post('/subscriptions/{restaurant}/pay', [\App\Http\Controllers\Admin\SubscriptionController::class, 'pay'])
        ->name('admin.subscriptions.pay');
    Route::post('/subscriptions/{restaurant}/suspend', [\App\Http\Controllers\Admin\SubscriptionController::class, 'suspend'])
        ->name('admin.subscriptions.suspend');
    Route::post('/subscriptions/{restaurant}/activate', [\App\Http\Controllers\Admin\SubscriptionController::class, 'activate'])
        ->name('admin.subscriptions.activate');
});
