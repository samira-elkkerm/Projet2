<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'status' => 200,
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'adress' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'telephone' => 'required|string|max:20',
            'Statut' => 'nullable|string|in:actif,inactif',
            'role' => 'nullable|string|in:client,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'ville' => $request->ville ?? '',
            'adress' => $request->adress,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'Statut' => $request->Statut,
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'ville' => $user->ville,
                'adress' => $user->adress,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'Statut' => $user->Statut,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'ville' => 'nullable|string|max:255',
            'adress' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$id,
            'password' => 'sometimes|string|min:8',
            'telephone' => 'sometimes|string|max:20',
            'Statut' => 'nullable|string|in:actif,inactif',
            'role' => 'nullable|string|in:client,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $data = $request->all();
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}