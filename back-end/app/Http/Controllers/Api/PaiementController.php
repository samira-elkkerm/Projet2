<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Récupérer toutes les commandes avec les informations de paiement
            $commandes = Commande::with(['user', 'ligneCommandes.produit'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Liste des paiements récupérée avec succès',
                'paiements' => $commandes
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de la récupération des paiements',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'commande_id' => 'required|exists:commandes,id',
                'montant' => 'required|numeric|min:0',
                'methode_paiement' => 'required|string|max:255',
                'reference' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Mise à jour du statut de la commande
            $commande = Commande::findOrFail($request->commande_id);
            
            // Vérifier si le montant correspond au total de la commande
            if ($request->montant < $commande->total) {
                return response()->json([
                    'status' => false,
                    'message' => 'Le montant payé est inférieur au total de la commande'
                ], 400);
            }

            // Mettre à jour le statut de paiement
            $commande->update([
                'statut_paiement' => 'Payé',
                'methode_paiement' => $request->methode_paiement,
                'reference_paiement' => $request->reference,
                'date_paiement' => now(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Paiement enregistré avec succès',
                'commande' => $commande
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de l\'enregistrement du paiement',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $commande = Commande::with(['user', 'ligneCommandes.produit'])
                ->findOrFail($id);

            return response()->json([
                'status' => true,
                'message' => 'Détails du paiement récupérés avec succès',
                'paiement' => $commande
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Paiement non trouvé',
                'error' => $th->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'statut_paiement' => 'required|string|in:Payé,Non payé,En attente,Annulé',
                'methode_paiement' => 'nullable|string|max:255',
                'reference' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Trouver la commande
            $commande = Commande::findOrFail($id);

            // Préparer les données de mise à jour
            $updateData = [
                'statut_paiement' => $request->statut_paiement,
            ];

            // Si le statut est "Payé", enregistrer la date de paiement
            if ($request->statut_paiement === 'Payé') {
                $updateData['date_paiement'] = now();
            }

            // Mettre à jour les informations de paiement si fournies
            if ($request->has('methode_paiement')) {
                $updateData['methode_paiement'] = $request->methode_paiement;
            }

            if ($request->has('reference')) {
                $updateData['reference_paiement'] = $request->reference;
            }

            // Mettre à jour la commande
            $commande->update($updateData);

            return response()->json([
                'status' => true,
                'message' => 'Statut de paiement mis à jour avec succès',
                'commande' => $commande
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de la mise à jour du paiement',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    try {
        // Recherche par numéro de commande plutôt que par ID
        $commande = Commande::where('numero_commande', $id)->first();

        if (!$commande) {
            return response()->json([
                'status' => false,
                'message' => 'Aucune commande trouvée avec ce numéro'
            ], 404);
        }

        // Vérifier si la commande peut être supprimée
        if ($commande->statut_paiement === 'Payé') {
            return response()->json([
                'status' => false,
                'message' => 'Impossible de supprimer une commande déjà payée'
            ], 400);
        }

        // Supprimer la commande et ses lignes associées
        $commande->ligneCommandes()->delete();
        $commande->delete();

        return response()->json([
            'status' => true,
            'message' => 'Commande supprimée avec succès'
        ], 200);

    } catch (\Throwable $th) {
        return response()->json([
            'status' => false,
            'message' => 'Erreur lors de la suppression de la commande',
            'error' => $th->getMessage()
        ], 500);
    }
}
}