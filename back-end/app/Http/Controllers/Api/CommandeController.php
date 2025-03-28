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
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'adress' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'frais_livraison' => 'required|numeric',
            'produites' => 'required|array', // Validation que produites est un tableau
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ]);
        } else {
            $commande = new Commande();
            $commande->user_id = $request->user_id;
            $commande->nom = $request->nom;
            $commande->prenom = $request->prenom;
            $commande->email = $request->email;
            $commande->telephone = $request->telephone;
            $commande->adress = $request->adress;
            $commande->ville = $request->ville;
            $commande->notes = $request->notes;
            $commande->frais_livraison = $request->frais_livraison;
            $commande->total_produits = $request->total_produits;
            $commande->total = $request->total; // ERREUR ! Cette colonne n'existe PAS !
            $commande->methode_paiement = 'à la livraison';
            $commande->save(); {/*foreach ($request->produites as $produit) {
                DB::table('commandes')->insert([ // Assurez-vous que cette table existe
                    'nom' => $produit['nom'],
                    'prix' => $produit['prix'],
                    'quantite' => $produit['quantite'],
                ]);
            }*/
            }
        }
        return response()->json([
            'status' => 200,
            'message' => 'Commande Created Successfully'
        ]);
    }


    public function edit($id) {}

    public function update(Request $request, $id) {}

    public function destroy($id) {}
}