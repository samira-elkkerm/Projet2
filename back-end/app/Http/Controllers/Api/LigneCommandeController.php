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
        // Détermine si c'est une commande unique ou multiple
        if ($request->has('id_produite')) {
            return $this->storeSingle($request);
        } elseif ($request->has('produits')) {
            return $this->storeMultiple($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Format de requête invalide. Utilisez soit id_produite/quantité soit produits[]'
        ], Response::HTTP_BAD_REQUEST);
    }

    protected function storeSingle(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        DB::beginTransaction();
        try {
            $idProduite = $request->id_produite;
            $quantiteAAjouter = $request->quantité;
            $idUtilisateur = $request->id_utilisateur;

            $produitStock = Produite::find($idProduite);
            if (!$produitStock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé',
                ], Response::HTTP_NOT_FOUND);
            }

            if ($produitStock->quantité < $quantiteAAjouter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant',
                    'available' => $produitStock->quantité,
                ], Response::HTTP_BAD_REQUEST);
            }

            $ligneCommande = LigneCommande::firstOrNew([
                'id_utilisateur' => $idUtilisateur,
                'id_produite' => $idProduite
            ]);

            if ($ligneCommande->exists) {
                $ligneCommande->quantité += $quantiteAAjouter;
            } else {
                $ligneCommande->quantité = $quantiteAAjouter;
            }

            $ligneCommande->save();

            $produitStock->quantité -= $quantiteAAjouter;
            $produitStock->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $ligneCommande->wasRecentlyCreated ? 'Produit ajouté au panier' : 'Quantité mise à jour dans le panier',
                'data' => $ligneCommande,
            ], $ligneCommande->wasRecentlyCreated ? Response::HTTP_CREATED : Response::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    protected function storeMultiple(Request $request)
    {
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
            $insertedIds = [];

            foreach ($request->produits as $produit) {
                $produitStock = Produite::find($produit['id_produite']);

                if (!$produitStock) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Produit ID {$produit['id_produite']} non trouvé"
                    ], Response::HTTP_NOT_FOUND);
                }

                if ($produitStock->quantité < $produit['quantité']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Stock insuffisant pour le produit ID {$produit['id_produite']}",
                        'available' => $produitStock->quantité
                    ], Response::HTTP_BAD_REQUEST);
                }

                $ligneCommande = LigneCommande::create([
                    'quantité' => $produit['quantité'],
                    'id_utilisateur' => $request->id_utilisateur,
                    'id_produite' => $produit['id_produite']
                ]);

                $produitStock->quantité -= $produit['quantité'];
                $produitStock->save();

                $commandes[] = $ligneCommande;
                $insertedIds[] = $ligneCommande->id;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Commandes créées avec succès',
                'data' => $commandes,
                'inserted_ids' => $insertedIds
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
        DB::beginTransaction();
        try {
            $ligneCommande = LigneCommande::findOrFail($id);
            $produit = $ligneCommande->produit;

            if ($produit) {
                $produit->quantité += $ligneCommande->quantité;
                $produit->save();
            }

            $ligneCommande->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé du panier avec succès'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

