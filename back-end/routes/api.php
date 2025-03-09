<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\LigneCommandeController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\LigneAchatController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\API\AuthController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('categories', CategoryController::class);

Route::apiResource('produites', ProduitController::class);

Route::apiResource('ligne-commandes', LigneCommandeController::class);

Route::apiResource('commandes', CommandeController::class);

Route::apiResource('paiements', PaiementController::class);

Route::apiResource('ligne-achats', LigneAchatController::class);

Route::apiResource('users', UserController::class);

Route::group(['prefix' => 'auth'], function () {
    // Inscription
    Route::post('/register', [AuthController::class, 'register']);

    // Connexion
    Route::post('/login', [AuthController::class, 'login']);

    // Déconnexion (protégée par Sanctum ou JWT)
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); // Ou 'auth:api' pour JWT

    // Récupérer les informations de l'utilisateur (protégée par Sanctum ou JWT)
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum'); // Ou 'auth:api' pour JWT
    // Rafraîchir le token (protégée par Sanctum ou JWT)
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum'); // Ou 'auth:api' pour JWT
});