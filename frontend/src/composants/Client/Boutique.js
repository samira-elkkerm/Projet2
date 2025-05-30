import React, { useEffect, useState, useCallback } from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faLeaf, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { debounce } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const Boutique = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id_categorie } = useParams();

  const handleViewDetails = (produitId) => {
    navigate(`/produit/${produitId}`);
  };

  const fetchProduits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/produites`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setProduits(data);
      
      // Si id_categorie est présent, filtrer les produits, sinon afficher tous les produits
      const filtered = id_categorie 
        ? data.filter(p => p.id_categorie == id_categorie)
        : data;
      
      setFilteredProduits(filtered);
    } catch (error) {
      setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, [id_categorie]);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  const handleSearch = debounce((term) => {
    const baseProduits = id_categorie
      ? produits.filter(p => p.id_categorie == id_categorie)
      : produits;

    if (!term) {
      setFilteredProduits(baseProduits);
      return;
    }

    const filtered = baseProduits.filter(p =>
      p.nom.toLowerCase().includes(term.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(term.toLowerCase()))
    );

    setFilteredProduits(filtered);
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
    return () => handleSearch.cancel();
  }, [searchTerm, produits, id_categorie]);

  return (
    <div className="page-container">
      <Navigation />

      <header className="shop-header">
        <h1 className="shop-title">
          <FontAwesomeIcon icon={faLeaf} className="title-icon" />
          {id_categorie ? "Plantes de cette catégorie" : "Notre Collection de Plantes"}
        </h1>

        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une plante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Rechercher des plantes"
          />
        </div>
      </header>

      <main className="shop-main-content">
        {isLoading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Chargement des produits...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchProduits} className="retry-button">
              Réessayer
            </button>
          </div>
        ) : filteredProduits.length === 0 ? (
          <div className="no-results">
            <p>Aucun produit ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProduits.map((produit) => (
              <article
                key={produit.id}
                className={`product-card ${hoveredProduct === produit.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredProduct(produit.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                aria-labelledby={`product-${produit.id}-title`}
              >
                <div className="product-image-container">
                  <img
                    src={`${API_BASE_URL}/images/${produit.image}`}
                    alt={produit.nom}
                    className="product-image"
                    loading="lazy"
                  />
                  {hoveredProduct === produit.id && (
                    <div className="product-overlay">
                      <button
                        onClick={() => handleViewDetails(produit.id)}
                        className="add-to-cart-btn"
                        aria-label={`Voir détails de ${produit.nom}`}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        Voir détails
                      </button>
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <h3 id={`product-${produit.id}-title`} className="product-name">
                    {produit.nom}
                  </h3>
                  {produit.categorie && (
                    <span className="product-category">{produit.categorie}</span>
                  )}
                  <p className="product-price">{produit.prix} DH</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Boutique;