<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;


class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'adress' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'telephone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->toArray());
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'ville' => $request->ville,
            'adress' => $request->adress,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'role' => 'client',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Authenticate a user and return a JWT token.
     */
    public function login(Request $request)
    {
        $validation = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'error' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        if ($request->input('remember')) {
            return response()->json([
                'user' => $user,
                'token' => $token,
            ])->cookie('remember_token', $token);
        }

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout the user and invalidate the token.
     */
    public function logout(Request $request) {}

    public function forgotPassword(Request $request)
    {
        \Illuminate\Support\Facades\Config::set('mail.log_channel', 'stack');
        \Illuminate\Support\Facades\Config::set('logging.channels.mail', [
            'driver' => 'single',
            'path' => storage_path('logs/mail.log'),
            'level' => 'debug',
        ]);
    
        $email = strtolower($request->email);
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();
    
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Si cet email existe, un lien a été envoyé'
            ]);
        }
    
        try {
            Mail::mailer()->getSymfonyTransport()->start();
    
            $token = Str::random(60);
            $user->update([
                'reset_token' => hash('sha256', $token),
                'reset_token_expires_at' => now()->addHours(1)
            ]);
    
            Mail::to($user->email)->send(new ResetPasswordMail($token));
    
            return response()->json([
                'success' => true,
                'message' => 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.',
            ]);
    
        } catch (\Swift_TransportException $e) {
            \Log::error('SMTP Connection Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion SMTP',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
            
        } catch (\Exception $e) {
            \Log::error('Mail Send Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur d\'envoi d\'email',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        // Hacher le token reçu pour le comparer avec celui en base
        $hashedToken = hash('sha256', $request->token);
        
        $user = User::where('reset_token', $hashedToken)
                  ->where('reset_token_expires_at', '>', now())
                  ->first();
    
        if (!$user) {
            return response()->json([
                'message' => 'Token invalide ou expiré',
                'errors' => [
                    'token' => ['Token invalide ou expiré']
                ]
            ], 400);
        }
    
        $user->password = Hash::make($request->password);
        $user->reset_token = null;
        $user->reset_token_expires_at = null;
        $user->save();
    
        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès'
        ]);
    }
}