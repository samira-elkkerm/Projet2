<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Enregistrer un nouvel utilisateur.
     */
    public function register(Request $request)
    {
        // Implémentez la logique d'inscription ici
    }


    public function login(Request $request)
    {
        // Implémentez la logique de connexion ici
    }


    public function logout(Request $request)
    {
        // Implémentez la logique de déconnexion ici
    }


    public function user(Request $request)
    {
        // Implémentez la logique pour récupérer les informations de l'utilisateur ici
    }


    public function refresh(Request $request)
    {
        // Implémentez la logique pour rafraîchir le token ici
    }
}