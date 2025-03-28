<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    use HasFactory;

    // Indiquez les attributs qui peuvent être assignés en masse
    protected $fillable = [
        'name',
        'prix-livraison',
    ];
}