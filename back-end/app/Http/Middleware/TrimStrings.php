<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;

class TrimStrings extends Middleware
{
    /**
     * Les attributs qui ne doivent pas être trimés.
     *
     * @var array
     */
    protected $except = [
        'password',
        'password_confirmation',
    ];
}
