<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthenticateJWT
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Vérifier si le token JWT est valide
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['error' => 'Utilisateur non trouvé.'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token JWT invalide.'], 401);
        }

        return $next($request);
    }
}
