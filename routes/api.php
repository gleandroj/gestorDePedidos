<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Bufallus\Models\ProgrammingFeedback;
use Bufallus\Models\UserCheckIn;

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
Route::middleware(['auth:api'])->group(function () {
    Route::pattern('user', '[0-9]+');
    Route::apiResource('users', 'User\UserController', ['except' => ['destroy']]);

    Route::pattern('item', '[0-9]+');
    Route::apiResource('items', 'Item\ItemController');
    Route::get('items/all', 'Item\ItemController@all');

    Route::pattern('order', '[0-9]+');
    Route::apiResource('orders', 'Order\OrderController');

    Route::get('dashboard', 'Dashboard\DashboardController@top');
    Route::post('dashboard/data', 'Dashboard\DashboardController@data');

});

Route::post('report/items', 'Report\ReportController@paginate');
