<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PayMongoController;

Route::post('/create-payment-link', [PayMongoController::class, 'createPaymentLink']);

Route::get('/', function () {
    return redirect('/home');
});


Route::get('/{any}', function () {
    return view('app'); 
})->where('any', '.*');