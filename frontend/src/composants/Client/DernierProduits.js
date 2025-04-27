import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

import { fetchProduits } from '../../redux/actions/produitsActions';
import '../../App.css';

const DernierProduits = () => {
  const dispatch = useDispatch();
  const produits = useSelector((state) => state.produits);

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  return (
    <div className="dernier-produits">
        {produits && produits.length > 0 ? (
          produits.sort(() => Math.random() - 0.5).slice(0, 2).map((produit) => (
            <div key={produit.id} className="dernier-produit">
              <div className="card-image">
                <img src={`http://127.0.0.1:8000/images/${produit.image}`} alt={produit.nom} />
              </div>
              <div className="card-items">
                <h3 className="card-title fs-3">{produit.nom}</h3>
                <p>{produit.description}</p>
                <span className='card-text'>{produit.prix} MAD</span>
                <Link to={`/produits/${produit.id}`} className="voir-plus">
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