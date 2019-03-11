<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Bufallus\Models\ProgrammingFeedback;
use Bufallus\Models\UserCheckIn;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

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

    Route::pattern('items', '[0-9]+');
    Route::apiResource('menus', 'Item\MenuController');
});
