import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

import '../../App.css';

const DernierProduits = () => {
  const [produites, setProduites] = useState([]);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/produites");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduites(data);
      } catch (error) {
        console.error("Error fetching panier data:", error);
      }
    };

    fetchPanier();
  }, []);

  return (
    <div className="dernier-produits">
        {produites && produites.length > 0 ? (
          produites.sort(() => Math.random() - 0.5).slice(0, 2).map((produit) => (
            <div key={produit.id} className="dernier-produit">
              <div className="card-image">
                <img src={`http://127.0.0.1:8000/images/${produit.image}`} alt={produit.nom} />
              </div>
              <div className="card-items">
                <h3 className="card-title fs-3">{produit.nom}</h3>
                <p>{produit.description}</p>
                <span className='card-text'>{produit.prix} MAD</span>
                <Link to={`/produit/${produit.id}`} className="voir-plus">
                  <span>Voir plus</span>
                  <FontAwesomeIcon icon={faArrowRightLong} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune produit disponible.</p>
        )}
    </div>
  );
};

export default DernierProduits;