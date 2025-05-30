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
            'email' => 'mytoudert@gmail.com',
            'password' => Hash::make('password123'), 
            'telephone' => '1234567890',
            'role' => 'admin', 
        ]);

        User::create([
            'nom' => 'Smith',
            'prenom' => 'Jane',
            'adress' => '456 Another St',
            'email' => 'jane.smith@example.com',
            'password' => Hash::make('password123'),
            'telephone' => '9876543210',
            'role' => 'client',
        ]);

Categorie::create(['type' => 'Plantes d\'intérieur']);
Categorie::create(['type' => 'Plantes d\'extérieur']);
Categorie::create(['type' => 'Plantes aromatiques']);
Categorie::create(['type' => 'Plantes succulentes']);
Categorie::create(['type' => 'Cactus']);
Categorie::create(['type' => 'Arbres fruitiers']);
Categorie::create(['type' => 'Arbustes d\'ornement']);
Categorie::create(['type' => 'Fleurs annuelles']);
Categorie::create(['type' => 'Fleurs vivaces']);
Categorie::create(['type' => 'Plantes grimpantes']);
Categorie::create(['type' => 'Plantes aquatiques']);
Categorie::create(['type' => 'Outils de jardinage']);
Categorie::create(['type' => 'Arrosage et irrigation']);
Categorie::create(['type' => 'Engrais et soins des plantes']);
Categorie::create(['type' => 'Pots et jardinières']);
Categorie::create(['type' => 'Terreaux et substrats']);
Categorie::create(['type' => 'Décoration de jardin']);
Categorie::create(['type' => 'Protection des plantes']);
Categorie::create(['type' => 'Serres et abris']);
Categorie::create(['type' => 'Éclairage pour plantes']);

       
        // 1. Plantes d'intérieur
        Produite::create([
            'nom' => 'Ficus Lyrata',
            'image' => 'ficus-lyrata.jpg',
            'description' => 'Le Ficus Lyrata, ou "Fiddle Leaf Fig", est une plante d\'intérieur très prisée pour ses grandes feuilles vert foncé en forme de violon. Elle purifie l\'air et nécessite une lumière indirecte. Parfaite pour les salons et bureaux.',
            'prix' => 89.99,
            'date' => now(),
            'quantité' => 15,
            'id_categorie' => 1,
        ]);

        Produite::create([
            'nom' => 'Monstera Deliciosa',
            'image' => 'monstera.jpg',
            'description' => 'La Monstera, avec ses feuilles perforées caractéristiques, est une plante tropicale facile à entretenir. Elle apporte une touche exotique à votre intérieur et supporte bien la mi-ombre.',
            'prix' => 45.50,
            'date' => now(),
            'quantité' => 20,
            'id_categorie' => 1,
        ]);

        // 2. Plantes d'extérieur
        Produite::create([
            'nom' => 'Lavande',
            'image' => 'lavande.jpg',
            'description' => 'La lavande, avec son parfum apaisant et ses fleurs violettes, est idéale pour les jardins secs. Elle attire les pollinisateurs et résiste à la sécheresse.',
            'prix' => 12.50,
            'date' => now(),
            'quantité' => 30,
            'id_categorie' => 2,
        ]);

        Produite::create([
            'nom' => 'Hortensia',
            'image' => 'hortensia.jpg',
            'description' => 'L\'hortensia offre de magnifiques boules de fleurs bleues, roses ou blanches. Il préfère les sols acides et une exposition mi-ombre. Parfait pour les bordures.',
            'prix' => 22.90,
            'date' => now(),
            'quantité' => 18,
            'id_categorie' => 2,
        ]);

        // 3. Plantes aromatiques
        Produite::create([
            'nom' => 'Basilic',
            'image' => 'basilic.jpg',
            'description' => 'Le basilic est une herbe aromatique incontournable en cuisine méditerranéenne. Facile à cultiver en pot, il nécessite du soleil et un arrosage régulier.',
            'prix' => 5.99,
            'date' => now(),
            'quantité' => 50,
            'id_categorie' => 3,
        ]);

        Produite::create([
            'nom' => 'Menthe Poivrée',
            'image' => 'menthe.jpg',
            'description' => 'La menthe poivrée, avec son parfum frais, est parfaite pour les thés et cocktails. Vigoureuse, elle se cultive en pot pour éviter qu\'elle n\'envahisse le jardin.',
            'prix' => 4.50,
            'date' => now(),
            'quantité' => 40,
            'id_categorie' => 3,
        ]);

        // 4. Plantes succulentes
        Produite::create([
            'nom' => 'Echeveria',
            'image' => 'echeveria.jpg',
            'description' => 'L\'Echeveria est une succulente aux rosettes colorées, très résistante. Elle nécessite peu d\'eau et beaucoup de lumière, idéale pour les terrariums.',
            'prix' => 8.50,
            'date' => now(),
            'quantité' => 25,
            'id_categorie' => 4,
        ]);

        Produite::create([
            'nom' => 'Haworthia',
            'image' => 'haworthia.jpg',
            'description' => 'L\'Haworthia, avec ses feuilles striées, est une petite succulente parfaite pour les bureaux. Elle tolère bien la faible luminosité et les oublis d\'arrosage.',
            'prix' => 7.20,
            'date' => now(),
            'quantité' => 35,
            'id_categorie' => 4,
        ]);

        // 5. Cactus
        Produite::create([
            'nom' => 'Cactus Cierge',
            'image' => 'cactus-cierge.jpg',
            'description' => 'Ce cactus vertical (Cereus) est résistant et décoratif. Il nécessite très peu d\'eau et beaucoup de soleil, parfait pour les débutants.',
            'prix' => 14.99,
            'date' => now(),
            'quantité' => 20,
            'id_categorie' => 5,
        ]);

        Produite::create([
            'nom' => 'Opuntia',
            'image' => 'opuntia.jpg',
            'description' => 'L\'Opuntia, ou "Figuier de Barbarie", produit des raquettes plates et des fruits comestibles. Résistant au froid et très graphique.',
            'prix' => 18.50,
            'date' => now(),
            'quantité' => 12,
            'id_categorie' => 5,
        ]);

        // 6. Arbres fruitiers
        Produite::create([
            'nom' => 'Citronnier 4 Saisons',
            'image' => 'citronnier.jpg',
            'description' => 'Ce citronnier produit des fruits presque toute l\'année. Adapté aux climats doux ou à la culture en pot. Fleurs blanches parfumées.',
            'prix' => 49.99,
            'date' => now(),
            'quantité' => 10,
            'id_categorie' => 6,
        ]);

        Produite::create([
            'nom' => 'Olivier',
            'image' => 'olivier.jpg',
            'description' => 'L\'olivier est un arbre méditerranéen symbole de paix. Résistant à la sécheresse, il peut vivre des siècles. Donne des olives après quelques années.',
            'prix' => 79.90,
            'date' => now(),
            'quantité' => 8,
            'id_categorie' => 6,
        ]);

        // 7. Outils de jardinage
        Produite::create([
            'nom' => 'Sécateur Professionnel',
            'image' => 'secateur.jpg',
            'description' => 'Sécateur à lames en acier trempé pour des coupes nettes. Poignée ergonomique et système de verrouillage sécurisé. Garantie 5 ans.',
            'prix' => 24.99,
            'date' => now(),
            'quantité' => 40,
            'id_categorie' => 12,
        ]);

        Produite::create([
            'nom' => 'Pelle Ergonomique',
            'image' => 'pelle.jpg',
            'description' => 'Pelle en acier inoxydable avec manche en bois traité. Idéale pour creuser et transplanter sans se fatiguer le dos. Longueur : 110 cm.',
            'prix' => 32.50,
            'date' => now(),
            'quantité' => 25,
            'id_categorie' => 12,
        ]);

        // 8. Pots et jardinières
        Produite::create([
            'nom' => 'Jardinière en Bois',
            'image' => 'jardiniere-bois.jpg',
            'description' => 'Jardinière en bois traité (80x30x30 cm) pour balcon ou terrasse. Design moderne et résistant aux intempéries. Facile à assembler.',
            'prix' => 59.99,
            'date' => now(),
            'quantité' => 12,
            'id_categorie' => 14,
        ]);

        Produite::create([
            'nom' => 'Pot en Céramique Émaillée',
            'image' => 'pot-ceramique.jpg',
            'description' => 'Pot décoratif de 30 cm de diamètre, avec soucoupe. Drainage optimal pour les plantes d\'intérieur. Disponible en plusieurs coloris.',
            'prix' => 34.90,
            'date' => now(),
            'quantité' => 20,
            'id_categorie' => 14,
        ]);

        // 9. Engrais et soins
        Produite::create([
            'nom' => 'Engrais Universel Bio',
            'image' => 'engrais-bio.jpg',
            'description' => 'Engrais organique pour toutes les plantes. Favorise une croissance saine et renforce les défenses naturelles. Respecte l\'environnement.',
            'prix' => 9.99,
            'date' => now(),
            'quantité' => 35,
            'id_categorie' => 13,
        ]);

        Produite::create([
            'nom' => 'Anti-Pucerons Naturel',
            'image' => 'anti-pucerons.jpg',
            'description' => 'Solution à base de pyrèthre pour éliminer les pucerons sans produits chimiques. Compatible avec l\'agriculture biologique.',
            'prix' => 12.80,
            'date' => now(),
            'quantité' => 30,
            'id_categorie' => 13,
        ]);

        // 10. Décoration de jardin
        Produite::create([
            'nom' => 'Fontaine Solaire',
            'image' => 'fontaine-solaire.jpg',
            'description' => 'Fontaine décorative fonctionnant à l\'énergie solaire. Jet d\'eau apaisant, résistante aux UV. Dimensions : 45 cm de hauteur.',
            'prix' => 79.99,
            'date' => now(),
            'quantité' => 8,
            'id_categorie' => 16,
        ]);

        Produite::create([
            'nom' => 'Statue de Jardin en Pierre',
            'image' => 'statue-jardin.jpg',
            'description' => 'Statue en pierre reconstituée (hauteur 60 cm) représentant un ange. Résistante au gel et aux intempéries. Poids : 15 kg.',
            'prix' => 129.90,
            'date' => now(),
            'quantité' => 5,
            'id_categorie' => 16,
        ]);

            

    }
}
