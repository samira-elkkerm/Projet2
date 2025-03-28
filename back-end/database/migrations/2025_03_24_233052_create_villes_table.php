<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Ajout de l'importation pour DB

class CreateVillesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('villes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom de la ville
            $table->decimal('prix-livraison', 8, 2); // Frais de livraison
            $table->timestamps();
        });

        // Insertion des villes et frais de livraison
        DB::table('villes')->insert([
            ['name' => 'Casablanca', 'prix-livraison' => 30.00],
            ['name' => 'Rabat', 'prix-livraison' => 25.00],
            ['name' => 'Marrakech', 'prix-livraison' => 35.00],
            ['name' => 'Fès', 'prix-livraison' => 28.00],
            ['name' => 'Tanger', 'prix-livraison' => 32.00],
            ['name' => 'Agadir', 'prix-livraison' => 40.00],
            ['name' => 'Oujda', 'prix-livraison' => 45.00],
            ['name' => 'Kenitra', 'prix-livraison' => 20.00],
            ['name' => 'Tétouan', 'prix-livraison' => 38.00],
            ['name' => 'Safi', 'prix-livraison' => 30.00],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('villes'); // Suppression de la table
    }
}