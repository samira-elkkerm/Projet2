<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\LigneCommandeController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\LigneAchatController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\API\AuthController;
use Illuminate\Auth\Events\Verified;
use App\Http\Controllers\Api\VilleController;
use App\Http\Controllers\API\ContactController;

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

Route::get('/villes', [VilleController::class, 'index']);
Route::get('/villes/{id}', [VilleController::class, 'show']);
Route::post('/commandes', [CommandeController::class, 'store']);
Route::put('/commandes/{numeroCommande}/status', [CommandeController::class, 'updateStatus']);
     Route::apiResource('categories', CategorieController::class);

Route::apiResource('produites', ProduitController::class);

Route::apiResource('ligne-commandes', LigneCommandeController::class);

Route::get('/images/{filename}', [ProduitController::class, 'getProductImage']);

Route::apiResource('commandes', CommandeController::class);

Route::apiResource('paiements', PaiementController::class);

Route::apiResource('ligne-achats', LigneAchatController::class);

Route::apiResource('users', UserController::class);
Route::get('/users/{user}', [UserController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/admin/dashboard', [userController::class, 'index'])->name('admin.dashboard');

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json([
            'message' => 'Please check your email for the verification link.',
        ]);
    })->middleware('throttle:6,1')->name('verification.send');

    Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
        if (!hash_equals((string) $id, (string) $request->user()->getKey())) {
            return response()->json(['message' => 'Invalid user ID'], 400);
        }

        if (!hash_equals((string) $hash, sha1($request->user()->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid hash'], 400);
        }

        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return response()->json(['message' => 'Email verified successfully!']);
    })->name('verification.verify');
});


Route::post('/send-email', [ContactController::class, 'sendEmail']);
