<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_utilisateur')->constrained('users')->onDelete('cascade')->onupdate('cascade');
            $table->foreignId('id_ligneCommande')->constrained('ligne_commandes')->onDelete('cascade')->onupdate('cascade');
            $table->float('total');
            $table->enum('status', ['en_attend', 'en_cours','livré'])->default('en_attend');
            $table->date('date_commande')->default(\DB::raw('CURRENT_DATE'));
            $table->date('date_livraison')->nullable();
            $table->timestamps();   
             });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
