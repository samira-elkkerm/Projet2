import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduits } from '../../redux/actions/produitsActions';
import '../../App.css';
import { Link } from 'react-router-dom';

const ListProduits = () => {
  const dispatch = useDispatch();
  const produits = useSelector((state) => state.produits);

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  return (
    <div className="produits">
        {produits && produits.length > 0 ? (
          produits.sort(() => Math.random() - 0.5).map((produit) => (
            <div key={produit.id}>
              <Link to={`/produits/${produit.id}`} className="text-decoration-none text-black">
                <div className="card-image">
                  <img src={`http://127.0.0.1:8000/images/${produit.image}`} alt={produit.nom} />
                </div>
                <div className="card-items">
                  <h3 className="card-title fs-4">{produit.nom}</h3>
                  <span className='card-text'>{produit.prix} MAD</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Aucune produit disponible.</p>
        )}
    </div>
  );
};

export default ListProduits;