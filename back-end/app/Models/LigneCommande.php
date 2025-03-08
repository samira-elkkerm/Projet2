<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantité',
        'id_produite',
    ];

    // Relation avec le produit
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'id_produite');
    }
}
