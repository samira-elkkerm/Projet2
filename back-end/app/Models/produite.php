<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class produite extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'image',
        'description',
        'prix',
        'date',
        'quantité',
        'id_categorie',
    ];

    // Relation avec la catégorie
    public function categorie()
    {
        return $this->belongsTo(Category::class, 'id_categorie');
    }
}
