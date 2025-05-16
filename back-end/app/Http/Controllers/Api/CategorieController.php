<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categorie;
use Illuminate\Http\Response;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Categorie::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['type' => 'required|string|max:255']);
        $categorie = Categorie::create(['type' => $request->type]);
        return response()->json($categorie, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categorie = Categorie::find($id);
        
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        return response()->json($categorie);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $categorie = Categorie::find($id);
        
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        $request->validate(['type' => 'required|string|max:255']);
        
        $categorie->update(['type' => $request->type]);
        
        return response()->json($categorie);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = Categorie::find($id);
        
        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }
        
        $categorie->delete();
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}