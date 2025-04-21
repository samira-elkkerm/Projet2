<!DOCTYPE html>
<html>
<head>
    <title>Nouveau message de contact</title>
</head>
<body>
    <h2>Nouvelle demande de contact</h2>
    <p><strong>Nom :</strong> {{ $data['nom'] }}</p>
    <p><strong>Prénom :</strong> {{ $data['prenom'] }}</p>
    <p><strong>Email :</strong> {{ $data['email'] }}</p>
    <p><strong>Téléphone :</strong> {{ $data['telephone'] }}</p>
    <p><strong>Message :</strong></p>
    <p>{{ $data['message'] }}</p>
</body>
</html>
