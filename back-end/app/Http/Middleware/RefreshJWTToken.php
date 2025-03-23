<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class RefreshJWTToken
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        try {
            // Rafraîchir le token JWT
            $newToken = JWTAuth::parseToken()->refresh();
            $response->headers->set('Authorization', 'Bearer ' . $newToken);
        } catch (JWTException $e) {
            // Gérer les erreurs de rafraîchissement
        }

        return $response;
    }
}
