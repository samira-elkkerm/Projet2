<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_utilisateur',
        'id_ligneCommande',
        'total',
        'status',
        'date_commande',
        'date_livraison',
    ];

    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    // Relation avec la ligne de commande
    public function ligneCommande()
    {
        return $this->belongsTo(LigneCommande::class, 'id_ligneCommande');
    }
}
