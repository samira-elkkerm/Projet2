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
        Schema::create('produites', function (Blueprint $table) {
                $table->id(); 
                $table->string('nom'); 
                $table->string('image'); 
                $table->text('description');
                $table->float('prix');
                $table->date('date')->default(\DB::raw('CURRENT_DATE')); 
                $table->integer('quantité'); 
                $table->foreignId('id_categorie')->constrained('categories')->onDelete('cascade')->onupdate('cascade'); 
                $table->timestamps(); 
            });    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produites');
    }
};
