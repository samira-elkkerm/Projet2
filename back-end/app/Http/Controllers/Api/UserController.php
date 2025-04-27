<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'ville' => $user->ville,
            'adress' => $user->adress,
            'email' => $user->email,
            'telephone' => $user->telephone,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $user->nom = $request->input('nom');
        $user->prenom = $request->input('prenom');
        $user->ville = $request->input('ville');
        $user->adress = $request->input('adress');
        $user->email = $request->input('email');
        $user->telephone = $request->input('telephone');

        $user->save();

        return response()->json([
            'message' => "L'utilisateur a été mis à jour avec succès",
            'id' => $user->id,
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'ville' => $user->ville,
            'adress' => $user->adress,
            'email' => $user->email,
            'telephone' => $user->telephone,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}