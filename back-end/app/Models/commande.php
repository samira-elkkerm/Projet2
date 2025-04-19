<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'email',
        'telephone',
        'adress',
        'ville',
        'pays',
        'notes',
        'ligne_commande_id',
        'total_produits',
        'frais_livraison',
        'total_general',
        'methode_paiement',
        'statut'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function LigneCommande()
    {
        return $this->belongsTo(LigneCommande::class);
    }
}