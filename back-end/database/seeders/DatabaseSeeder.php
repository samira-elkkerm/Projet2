<?php

namespace Database\Seeders;


use App\Models\User;
use App\Models\Categorie;  
use App\Models\Produite;   
use App\Models\LigneCommande;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\LigneAchat;
use App\Models\Achat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'nom' => 'Doe',
            'prenom' => 'John',
            'adress' => '123 Main St',
            'email' => 'john.doe@example.com',
            'password' => Hash::make('password123'), // Assurez-vous de hasher le mot de passe
            'telephone' => '1234567890',
            'role' => 'admin', // ou 'client' selon le cas
        ]);

        // Exemple d'un autre utilisateur
        User::create([
            'nom' => 'Smith',
            'prenom' => 'Jane',
            'adress' => '456 Another St',
            'email' => 'jane.smith@example.com',
            'password' => Hash::make('password123'),
            'telephone' => '9876543210',
            'role' => 'client',
        ]);

        // Création de quelques categories  (plantes)
        Categorie::create(['type' => 'Plantes d\'intérieur']);
        Categorie::create(['type' => 'Plantes d\'extérieur']);
        Categorie::create(['type' => 'Plantes aquatiques']);





        // Création de quelques produits (plantes)
        Produite::create([
            'nom' => 'Ficus',
            'image' => 'ficus.jpg',
            'description' => 'Le Ficus est une plante d\'intérieur facile à entretenir.',
            'prix' => 150.00,
            'date' => now(),
            'quantité' => 10,
            'id_categorie' => 1, // Assurez-vous que l'ID de la catégorie existe (par exemple, 1 pour Plantes d\'intérieur)
        ]);

        Produite::create([
            'nom' => 'Lavande',
            'image' => 'lavande.jpg',
            'description' => 'La lavande est une plante d\'extérieur parfumée idéale pour le jardin.',
            'prix' => 80.00,
            'date' => now(),
            'quantité' => 5,
            'id_categorie' => 2, // Assurez-vous que l'ID de la catégorie existe (par exemple, 2 pour Plantes d\'extérieur)
        ]);

        Produite::create([
            'nom' => 'Nymphaea',
            'image' => 'nymphaea.jpg',
            'description' => 'Le Nymphaea, ou nénuphar, est une plante aquatique pour bassin.',
            'prix' => 120.00,
            'date' => now(),
            'quantité' => 8,
            'id_categorie' => 3, // Assurez-vous que l'ID de la catégorie existe (par exemple, 3 pour Plantes aquatiques)
        ]);



          // Créer quelques lignes de commande avec des produits existants
          LigneCommande::create([
            'quantité' => 2,
            'id_produite' => 1, // Assurez-vous que l'ID du produit existe
        ]);

        LigneCommande::create([
            'quantité' => 1,
            'id_produite' => 2, // Assurez-vous que l'ID du produit existe
        ]);

        LigneCommande::create([
            'quantité' => 3,
            'id_produite' => 3, // Assurez-vous que l'ID du produit existe
        ]);





         // Créer des commandes avec des utilisateurs et des lignes de commande existants
         $user1 = User::first(); // Assurez-vous qu'il y a un utilisateur dans la base de données
         $ligneCommande1 = LigneCommande::first(); // Assurez-vous qu'il y a une ligne de commande dans la base de données
 
         Commande::create([
             'id_utilisateur' => $user1->id,
             'id_ligneCommande' => $ligneCommande1->id,
             'total' => 200.00, // Exemple de total
             'status' => 'en_attend',
             'date_commande' => now(),
             'date_livraison' => null,
         ]);
 
         $user2 = User::skip(1)->first(); // Récupérer un autre utilisateur pour tester
         $ligneCommande2 = LigneCommande::skip(1)->first(); // Récupérer une autre ligne de commande
 
         Commande::create([
             'id_utilisateur' => $user2->id,
             'id_ligneCommande' => $ligneCommande2->id,
             'total' => 350.00, // Exemple de total
             'status' => 'en_cours',
             'date_commande' => now(),
             'date_livraison' => null,
         ]);




         // Créer des paiements pour les commandes existantes
        $commande1 = Commande::first(); // Assurez-vous qu'il y a une commande dans la base de données
        Paiement::create([
            'id_commande' => $commande1->id,
            'montant' => 200.00, // Exemple de montant
            'status' => 'payé',
        ]);

        $commande2 = Commande::skip(1)->first(); // Récupérer une autre commande
        Paiement::create([
            'id_commande' => $commande2->id,
            'montant' => 350.00, // Exemple de montant
            'status' => 'non_payé',
        ]);

        // Créer des lignes d'achats pour les produits existants
        $produite1 = Produite::first(); // Assurez-vous qu'il y a un produit dans la base de données
        LigneAchat::create([
            'quantité' => 10, // Exemple de quantité
            'id_produite' => $produite1->id,
            'prix' => 15.00, // Exemple de prix
        ]);

        $produite2 = Produite::skip(1)->first(); // Récupérer un autre produit
        LigneAchat::create([
            'quantité' => 5, // Exemple de quantité
            'id_produite' => $produite2->id,
            'prix' => 20.00, // Exemple de prix
        ]);




         // Créer des achats pour les lignes d'achats existantes
         $ligneAchat1 = LigneAchat::first(); // Assurez-vous qu'il y a une ligne d'achat dans la base de données
         Achat::create([
             'id_ligneAchat' => $ligneAchat1->id,
             'status' => 'en_attend', // Exemple de statut
         ]);
 
         $ligneAchat2 = LigneAchat::skip(1)->first(); // Récupérer une autre ligne d'achat
         Achat::create([
             'id_ligneAchat' => $ligneAchat2->id,
             'status' => 'en_cours', // Exemple de statut
         ]);









    }
}
