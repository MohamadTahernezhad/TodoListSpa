<?php

use App\Http\Controllers\IndexController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', [IndexController::class, 'index']);
Route::post('/task/create', [IndexController::class, 'TaskCreate']);
Route::put('/task/{task}', [IndexController::class, 'update']);
Route::delete('/task/{task}', [IndexController::class, 'destroy']);
Route::get('/get-all-tasks-data', [IndexController::class, 'GetAllTasksData']);

