import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ajouterProduit } from '../redux/actions/produitsActions';
import { ajouterCommande } from '../redux/actions/commandesActions';

const Accueil = () => {
  const produits = useSelector((state) => state.produits);
  const commandes = useSelector((state) => state.commandes);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue sur notre boutique 🌿</h1>

      <h2>Produits</h2>
      <button onClick={() => dispatch(ajouterProduit({ id: Date.now(), nom: 'Plante Verte' }))}>
        Ajouter un produit
      </button>
      {produits.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul>
          {produits.map((produit) => (
            <li key={produit.id}>{produit.nom}</li>
          ))}
        </ul>
      )}

      <h2>Commandes</h2>
      <button onClick={() => dispatch(ajouterCommande({ id: Date.now(), client: 'Client 1', statut: 'En attente' }))}>
        Ajouter une commande
      </button>
      {commandes.length === 0 ? (
        <p>Aucune commande passée.</p>
      ) : (
        <ul>
          {commandes.map((commande) => (
            <li key={commande.id}>{commande.client} - {commande.statut}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Accueil;
