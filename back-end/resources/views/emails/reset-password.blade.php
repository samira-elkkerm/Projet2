<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation de mot de passe</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 15px 0;
        }
        .footer { margin-top: 30px; font-size: 0.9em; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Réinitialisation de votre mot de passe</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :</p>
        
        <a href="http://localhost:3000/reset-password?token={{ $token }}" class="button">
            Réinitialiser mon mot de passe
        </a>
        
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        
        <div class="footer">
            <p>Ce lien expirera dans 1 heure.</p>
        </div>
    </div>
</body>
</html>