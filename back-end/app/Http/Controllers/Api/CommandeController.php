<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::all();
        return response()->json([
            'status' => 200,
            'commandes' => $commandes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'numero_commande' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'adress' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'frais_livraison' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        } else {
            $commande = new Commande();
            $commande->numero_commande = $request->numero_commande;
            $commande->user_id = $request->user_id;
            $commande->nom = $request->nom;
            $commande->prenom = $request->prenom;
            $commande->email = $request->email;
            $commande->telephone = $request->telephone;
            $commande->adress = $request->adress;
            $commande->ville = $request->ville;
            $commande->notes = $request->notes;
            $commande->ligne_commande_id = $request->ligne_commande_id;
            $commande->frais_livraison = $request->frais_livraison;
            $commande->total_produits = $request->total_produits;
            $commande->total = $request->total;
            $commande->methode_paiement = 'à la livraison';
            $commande->save();
        }
        return response()->json([
            'status' => 200,
            'message' => 'Commande Created Successfully'
        ]);
    }


    public function edit($id) {}

    public function update(Request $request, $id) {}

    public function destroy($numeroCommande)
{
    try {
        // Vérifier d'abord si des commandes existent avec ce numéro
        $commandes = Commande::where('numero_commande', $numeroCommande)->get();

        if ($commandes->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune commande trouvée avec ce numéro.'
            ], 404);
        }

        // Supprimer toutes les commandes avec ce numéro
        $deleted = Commande::where('numero_commande', $numeroCommande)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Toutes les commandes avec le numéro '.$numeroCommande.' ont été supprimées avec succès.',
            'deleted_count' => $deleted
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression des commandes: '.$e->getMessage()
        ], 500);
    }
}
}