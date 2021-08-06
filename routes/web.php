<?php

use App\Http\Controllers\DomainController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', [DomainController::class, 'index']);
Route::post('/insert', [DomainController::class, 'store']);
Route::get('/listData', [DomainController::class, 'listData']);
