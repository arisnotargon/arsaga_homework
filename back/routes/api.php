<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('createAccount', [AuthController::class, 'createAccount']);
Route::post('login', [AuthController::class, 'login']);
// Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,10');

Route::middleware('auth:api')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::get('logout', [AuthController::class, 'logout']);


    Route::post('article', [ArticleController::class, 'store']);
    Route::put('article/{id}', [ArticleController::class, 'update'])->where(['id' => '[0-9]+']);
    Route::delete('article/{id}', [ArticleController::class, 'delete'])->where(['id' => '[0-9]+']);
    Route::get('article', [ArticleController::class, 'list']);
    Route::get('article/{id}', [ArticleController::class, 'detail'])->where(['id' => '[0-9]+']);
});
