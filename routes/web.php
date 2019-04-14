<?php

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
Route::fallback(function () {
    $patch = request()->path();
    if (preg_match('/api/', $patch)) {
        abort(404, 'O recurso solicitado não está disponível.');
    }
    return redirect("/app\/", 301, [], true);
});
