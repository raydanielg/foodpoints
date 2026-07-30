<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

// Public auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public: customer scans QR
Route::get('/scan/{qrToken}', [TableController::class, 'scanQr']);
Route::get('/session/{sessionId}/orders', [OrderController::class, 'sessionOrders']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::get('/session/{sessionId}/payments', [PaymentController::class, 'sessionPayments']);

// Authenticated staff
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);
    Route::put('/restaurant/subscription', [AuthController::class, 'updateSubscription']);

    // Restaurant
    Route::get('/restaurant', [RestaurantController::class, 'show']);
    Route::put('/restaurant', [RestaurantController::class, 'update']);
    Route::get('/restaurant/stats', [RestaurantController::class, 'stats']);
    Route::get('/restaurant/payments', [RestaurantController::class, 'paymentsIndex']);

    // Menu categories
    Route::get('/menu/categories', [MenuController::class, 'categoriesIndex']);
    Route::post('/menu/categories', [MenuController::class, 'categoryStore']);
    Route::put('/menu/categories/{id}', [MenuController::class, 'categoryUpdate']);
    Route::delete('/menu/categories/{id}', [MenuController::class, 'categoryDestroy']);

    // Menu items
    Route::get('/menu/items', [MenuController::class, 'itemsIndex']);
    Route::post('/menu/items', [MenuController::class, 'itemStore']);
    Route::put('/menu/items/{id}', [MenuController::class, 'itemUpdate']);
    Route::delete('/menu/items/{id}', [MenuController::class, 'itemDestroy']);

    // Tables
    Route::get('/tables', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);
    Route::put('/tables/{id}', [TableController::class, 'update']);
    Route::delete('/tables/{id}', [TableController::class, 'destroy']);
    Route::post('/tables/{id}/regenerate-qr', [TableController::class, 'regenerateQr']);

    // Orders (staff)
    Route::get('/orders/kitchen', [OrderController::class, 'kitchenOrders']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::put('/orders/items/{itemId}/served', [OrderController::class, 'markItemServed']);

    // Payments (staff)
    Route::put('/payments/{id}/confirm-cash', [PaymentController::class, 'confirmCash']);

    // Staff
    Route::get('/staff', [StaffController::class, 'index']);
    Route::post('/staff', [StaffController::class, 'store']);
    Route::put('/staff/{id}', [StaffController::class, 'update']);
    Route::delete('/staff/{id}', [StaffController::class, 'destroy']);
});
