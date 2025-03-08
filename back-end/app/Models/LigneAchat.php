<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneAchat extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantité',
        'id_produite',
        'prix',
    ];

    // Relation avec le produit
    public function produite()
    {
        return $this->belongsTo(Produite::class, 'id_produite');
    }
}
