<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LigneCommande;
use App\Models\Produite;
use Illuminate\Http\Response; 

class LigneCommandeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ligneCommandes = LigneCommande::all();
        $produites = Produite::all();
        
        return response()->json([
            "ligneCommandes" => $ligneCommandes,
            "produites" => $produites
        ]);
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ligneCommande = LigneCommande::findOrFail($id);
        $ligneCommande->quantité = $request->quantité;
        $ligneCommande->save();

        return response()->json($ligneCommande);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    try {
        $ligneCommande = LigneCommande::findOrFail($id);
        $ligneCommande->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé du panier avec succès'
        ], Response::HTTP_OK); // Use the imported Response class
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression du produit'
        ], Response::HTTP_INTERNAL_SERVER_ERROR); // Use the imported Response class
    }
}
}