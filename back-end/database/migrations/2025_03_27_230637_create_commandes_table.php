<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email');
            $table->string('telephone');
            $table->string('adress');
            $table->string('ville');
            $table->string('pays')->default('Maroc');
            $table->text('notes')->nullable();
            $table->float('total_produits');
            $table->float('frais_livraison');
            $table->float('total');
            $table->string('methode_paiement')->default('à la livraison');
            $table->enum('statut', ['en_attente', 'En cour', 'Livre'])->default('en_attente');
            $table->timestamps();
        });

        Schema::create('ligne_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained()->onDelete('cascade');
            $table->foreignId('produit_id')->constrained();
            $table->integer('quantite');
            $table->float('prix_unitaire');
            $table->float('sous_total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ligne_commandes');
        Schema::dropIfExists('commandes');
    }
};