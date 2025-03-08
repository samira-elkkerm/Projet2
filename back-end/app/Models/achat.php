<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achat extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_ligneAchat',
        'status',
    ];

    // Relation avec la ligne d'achat
    public function ligneAchat()
    {
        return $this->belongsTo(LigneAchat::class, 'id_ligneAchat');
    }
}
