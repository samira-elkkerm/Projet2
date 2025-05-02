<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LigneCommande;
use App\Models\Produite;
use Illuminate\Http\Response; 
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


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
    // Validation (identique)
    $validator = Validator::make($request->all(), [
        'id_utilisateur' => 'required|exists:users,id',
        'produits' => 'required|array|min:1',
        'produits.*.id_produite' => 'required|exists:produites,id',
        'produits.*.quantité' => 'required|integer|min:1'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $validator->errors()
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    DB::beginTransaction();
    try {
        $commandes = [];
        $lastInsertId = null;

        foreach ($request->produits as $produit) {
            $produitStock = Produite::find($produit['id_produite']);

            if (!$produitStock || $produitStock->quantité < $produit['quantité']) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => "Stock insuffisant pour le produit ID {$produit['id_produite']}",
                    'available' => $produitStock ? $produitStock->quantité : 0
                ], Response::HTTP_BAD_REQUEST);
            }

            $commande = LigneCommande::create([
                'quantité' => $produit['quantité'],
                'id_utilisateur' => $request->id_utilisateur,
                'id_produite' => $produit['id_produite']
            ]);

            // Sauvegarde du dernier ID inséré
            $lastInsertId = $commande->id;

            $produitStock->quantité -= $produit['quantité'];
            $produitStock->save();

            $commandes[] = $commande;
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Lignes de commande créées avec succès',
            'data' => $commandes,
            'last_insert_id' => $lastInsertId, // Ajout du dernier ID
            'inserted_ids' => array_map(function($c) { return $c->id; }, $commandes) // Tous les IDs
        ], Response::HTTP_CREATED);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
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