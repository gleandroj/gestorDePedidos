<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\Printer;

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


    Route::pattern('order_item', '[0-9]+');
    Route::apiResource('orders/{order}/order_items', 'Order\OrderItemController', [
        'only' => ['store', 'update', 'destroy']
    ]);

    Route::get('dashboard', 'Dashboard\DashboardController@top');
    Route::post('dashboard/data', 'Dashboard\DashboardController@data');

});

//Route::post('test', 'Dialogflow\ChatbotController@test');

Route::get('/test', function () {
    /** @var \Bufallus\Models\Order $order */
    $order = \Bufallus\Models\Order::find(1);
    /** @var \Carbon\Carbon $createdAt */
    $createdAt = $order->created_at;
    $createdAt = $createdAt->format('d/m/Y H:m:s');

    $connector = new CupsPrintConnector("printer");
    $profile = CapabilityProfile::load("default");
    $printer = new Printer($connector, $profile);

    $tux = EscposImage::load(base_path("resources/frontend/src/assets/img/logo-print.png"), true);

    $printer->bitImage($tux);

    $printer->setJustification(Printer::JUSTIFY_CENTER);
    $printer->selectPrintMode(Printer::MODE_EMPHASIZED);
    $printer->text("Mesa: {$order->table}\n");
    $printer->selectPrintMode();
    $printer->setJustification(Printer::JUSTIFY_LEFT);
    $printer->feed();
    foreach ($order->items as $orderItem) {
        $item = $orderItem->item->description;
        $qty = $orderItem->quantity;
        $obs = $orderItem->observation;
        //TODO: Use pad left/right
        $printer->text("${qty}x  ${item}\n");
        $printer->text("Obs: ${obs}\n");
    }
    $printer->feed();
    $printer->text("Abertura: {$createdAt}\n");
    $printer->feed(2);
    $printer->cut();
    $printer->close();
});
