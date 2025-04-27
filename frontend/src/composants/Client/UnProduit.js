import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { fetchProduit } from '../../redux/actions/produitsActions';
import { modifierQuantite } from '../../redux/actions/panierActions';

import '../../App.css';

const UnProduit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const produit = useSelector((state) => state.produit);

  useEffect(() => {
    dispatch(fetchProduit(id));
  }, [dispatch, id]);

  const ajouterPanier = (produit) => {
    // Ajouter le produit au panier
    dispatch(modifierQuantite(produit.id, 1));
  };

  return (
    produit ? (
      <div className="produit">
        <div className="produit-img">
          <img src={`http://127.0.0.1:8000/images/${produit.image}`} alt={produit.nom} />
        </div>
        <div className="produit-items p-2">
          <h3 className="card-title fs-4">{produit.nom}</h3>
          <p>{produit.description}</p>
        </div>
        <div className="produit-price">
          <span className='card-text'>{produit.prix} MAD</span>
          <button onClick={() => ajouterPanier(produit)}>Ajouter au panier</button>
        </div>
      </div>
    ) : (
      <p>Aucune produit disponible.</p>
    )
  );
}

export default UnProduit