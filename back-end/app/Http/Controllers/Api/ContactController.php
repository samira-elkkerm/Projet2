<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;

class ContactController extends Controller
{
//     public function sendEmail(Request $request)
//     {
//         $request->validate([
//             'nom' => 'required|string|max:255',
//             'prenom' => 'required|string|max:255',
//             'email' => 'required|email',
//             'telephone' => 'required|regex:/^(\\+212|0)[6-7]\\d{8}$/',
//             'message' => 'required|string',
//         ]);

//         Mail::to('mytoudert@gmail.com')->send(new ContactMail($request->all()));

//         return response()->json(['success' => 'Le message a été envoyé avec succès !']);
//     }
// }


public function sendEmail(Request $request)
{
    // Validation de base
    $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string',
    ]);

    // Validation personnalisée pour le téléphone avec preg_match
    $telephone = $request->input('telephone');

    if (!preg_match('/^(\\+212|0)[6-7]\\d{8}$/', $telephone)) {
        return response()->json(['error' => 'Numéro de téléphone invalide'], 400);
    }

    // Envoi de l'email
    Mail::to('mytoudert@gmail.com')->send(new ContactMail($request->all()));

    return response()->json(['success' => 'Le message a été envoyé avec succès !']);
}
}