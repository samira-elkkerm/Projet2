<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LigneCommande;
use App\Models\Produite; // ou Produit si c'est votre vrai modèle
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LigneCommandeController extends Controller
{
    public function index()
    {
        $ligneCommandes = LigneCommande::with(['produit', 'utilisateur'])->get();
        $produites = Produite::all();

        return response()->json([
            "success" => true,
            "ligneCommandes" => $ligneCommandes,
            "produites" => $produites
        ]);
    }

    public function store(Request $request)
{
    $input = $request->all();

    // Validation des données
    $validator = Validator::make($input, [
        'id_utilisateur' => 'required|exists:users,id',
        'id_produite' => 'required|exists:produites,id',
        'quantité' => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $validator->errors()
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    try {
        // Recherche d'une ligne existante pour cet utilisateur + produit
        $ligneCommande = LigneCommande::where('id_utilisateur', $input['id_utilisateur'])
            ->where('id_produite', $input['id_produite'])
            ->first();

        $produitStock = Produite::find($input['id_produite']);
        if (!$produitStock) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé',
            ], Response::HTTP_NOT_FOUND);
        }

        // Calcul de la quantité à ajouter
        $quantiteAAjouter = $input['quantité'];

        if ($ligneCommande) {
            // Si la ligne existe, on va augmenter la quantité
            $nouvelleQuantite = $ligneCommande->quantité + $quantiteAAjouter;

            // Vérifier stock disponible
            if ($produitStock->quantité < $quantiteAAjouter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant',
                    'available' => $produitStock->quantité,
                ], Response::HTTP_BAD_REQUEST);
            }

            // Met à jour la ligne commande
            $ligneCommande->quantité = $nouvelleQuantite;
            $ligneCommande->save();

            // Met à jour le stock
            $produitStock->quantité -= $quantiteAAjouter;
            $produitStock->save();

            return response()->json([
                'success' => true,
                'message' => 'Quantité mise à jour dans le panier',
                'data' => $ligneCommande,
            ], Response::HTTP_OK);
        } else {
            // Nouvelle ligne commande
            if ($produitStock->quantité < $quantiteAAjouter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant',
                    'available' => $produitStock->quantité,
                ], Response::HTTP_BAD_REQUEST);
            }

            $ligneCommande = LigneCommande::create([
                'quantité' => $quantiteAAjouter,
                'id_utilisateur' => $input['id_utilisateur'],
                'id_produite' => $input['id_produite'],
            ]);

            // Mise à jour du stock
            $produitStock->quantité -= $quantiteAAjouter;
            $produitStock->save();

            return response()->json([
                'success' => true,
                'message' => 'Produit ajouté au panier',
                'data' => $ligneCommande,
            ], Response::HTTP_CREATED);
        }
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


    public function show(string $id)
    {
        $ligneCommande = LigneCommande::with(['produit', 'utilisateur'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $ligneCommande
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'quantité' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $ligneCommande = LigneCommande::findOrFail($id);
        $ligneCommande->quantité = $request->quantité;
        $ligneCommande->save();

        return response()->json([
            'success' => true,
            'message' => 'Ligne de commande mise à jour',
            'data' => $ligneCommande
        ]);
    }

    public function destroy($id)
    {
        try {
            $ligneCommande = LigneCommande::findOrFail($id);
            $produit = $ligneCommande->produit;

            // Restauration du stock
            $produit->quantité += $ligneCommande->quantité;
            $produit->save();

            $ligneCommande->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé du panier avec succès'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
}

