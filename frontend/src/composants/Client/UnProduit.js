import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import '../../App.css';

const UnProduit = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/produites");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduit(data?.find((produit) => produit.id === parseInt(id)) || null);
      } catch (error) {
        console.error("Error fetching panier data:", error);
      }
    };

    fetchPanier();
  }, [id]);

  const ajouterPanier = (produit) => {
    // Ajouter le produit au panier
    alert(`Produit ${produit.nom} ajouté au panier.`);
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