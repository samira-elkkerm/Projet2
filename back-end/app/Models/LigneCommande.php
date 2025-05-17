<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    protected $fillable = [
        'quantité',
        'id_utilisateur',
        'id_produite'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    public function produit()
    {
        return $this->belongsTo(Produite::class, 'id_produite');
    }
}