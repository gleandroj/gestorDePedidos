<?php

use Illuminate\Support\Facades\Route;

/**
 * Public Api
 */
Route::group(['prefix' => '/auth'], function () {
    /**
     * Register User End Point's
     */
    Route::post('available/email', 'Auth\RegisterController@verifyUniqueEmail');
    Route::post('available/cellphone', 'Auth\RegisterController@verifyUniqueCellphone');
    Route::post('register', 'Auth\RegisterController@register');

    /**
     * Authentication End Point's
     */
    Route::post('login', 'Auth\LoginController@login');
    Route::post('refresh', 'Auth\LoginController@refresh');
    Route::post('logout', 'Auth\LoginController@logout')->middleware('auth');
    Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('password/reset', 'Auth\ResetPasswordController@reset');
});

/**
 * Auth API
 */
Route::post('report/items', 'Report\ReportController@paginate');
Route::middleware(['auth:api'])->group(function () {
    Route::pattern('user', '[0-9]+');
    Route::apiResource('users', 'User\UserController', ['except' => ['destroy']]);

    Route::pattern('item', '[0-9]+');
    Route::apiResource('items', 'Item\ItemController');
    Route::get('items/all', 'Item\ItemController@all');

    Route::pattern('order', '[0-9]+');
    Route::apiResource('orders', 'Order\OrderController');
    Route::post('orders/{order}/print', 'Order\OrderController@print');

    Route::pattern('order_item', '[0-9]+');
    Route::apiResource('orders/{order}/order_items', 'Order\OrderItemController', [
        'only' => ['store', 'update', 'destroy']
    ]);

    Route::get('dashboard', 'Dashboard\DashboardController@top');
    Route::post('dashboard/data', 'Dashboard\DashboardController@data');

});
