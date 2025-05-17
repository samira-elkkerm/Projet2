import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

import NavigationBar from '../../layout/Navigation';
import Footer from '../../layout/Footer';

const DetailProduit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Chargement du produit courant
    axios.get(`http://localhost:8000/api/produites/${id}`)
      .then(response => {
        setProduct(response.data);
        setDisplayedPrice(response.data.prix);
      })
      .catch(error => {
        console.error('Erreur de chargement du produit', error);
        setErrorMessage('Erreur de chargement du produit');
      });

    // Chargement des 4 premiers produits (pour la section produits similaires)
    axios.get(`http://localhost:8000/api/produites`)
      .then(response => {
        // On récupère la liste complète et on slice pour prendre 4 produits
        const produits = response.data.produites || response.data || [];
        setRelatedProducts(produits.slice(0, 4));
      })
      .catch(error => {
        console.error('Erreur de chargement des produits similaires', error);
      });
  }, [id]);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    setErrorMessage('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/ligne-commandes', {
        id_utilisateur: parseInt(userId),
        id_produite: parseInt(id),
        quantité: quantity,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        navigate('/Panier');
      } else {
        throw new Error(`Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      let errorMsg = "Erreur lors de l'ajout au panier";
      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = "Veuillez vous connecter";
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = `Erreur serveur: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMsg = "Pas de réponse du serveur";
      } else {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) return <p>Chargement...</p>;

  return (
    <>
      <NavigationBar />
      <div className="product-detail-container">
        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <div className="product-detail-content">
          <div className="product-image-section">
            <img 
              src={`http://127.0.0.1:8000/images/${product.image}`} 
              alt={product.nom} 
              className="product-image"
            />
            <div className="product-description-section">
              <h5 className="description-title">Description du produit</h5>
              <p className="product-description">{product.description}</p>
            </div>
          </div>

          <div className="product-info-section">
            <h2 className="product-title">{product.nom}</h2>

            <div className="price-info">
              <span className="info-label">Prix :</span>
              <span className="info-value">{displayedPrice} MAD</span>
            </div>

            <div className="info-item quantity-selector">
              <span className="info-label">Quantité :</span>
              <button className="quantity-btn" onClick={handleDecrease}>-</button>
              <span className="quantity-number">{quantity}</span>
              <button className="quantity-btn" onClick={handleIncrease}>+</button>
            </div>

            <div className="action-buttons">
              <button
                className="validate-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
              </button>
              <button
                className="continue-btn"
                onClick={() => navigate('/boutique')}
              >
                Continuer vos achats
              </button>
            </div>
          </div>
        </div>

        <div className="related-products-section">
          <div className="related-products">
            {relatedProducts.map(item => (
              <div key={item.id} className="related-product-card">
                <img 
                  src={`http://127.0.0.1:8000/images/${item.image}`} 
                  alt={item.nom}
                  className="related-product-image"
                />
                <p className="related-product-name">{item.nom}</p>
                <p className="info-value">{item.prix} <span>MAD</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailProduit;
