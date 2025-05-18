import React, { useEffect, useState, useCallback } from 'react';
import Footer from '../../layout/Footer';
import Navigation from '../../layout/Navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faLeaf, faSearch, faSpinner, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const PRODUCTS_PER_PAGE = 9;

const Boutique = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleViewDetails = (produitId) => {
    navigate(`/produit/${produitId}`);
  };

  // Chargement des produits
  const fetchProduits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/produites`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setProduits(data);
      setFilteredProduits(data);
      setCurrentPage(1); // reset page on fetch
    } catch (error) {
      setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  // Recherche avec debounce
  const handleSearch = debounce((term) => {
    if (!term) {
      setFilteredProduits(produits);
      setCurrentPage(1);
      return;
    }
    const filtered = produits.filter(produit =>
      produit.nom.toLowerCase().includes(term.toLowerCase()) ||
      (produit.description && produit.description.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredProduits(filtered);
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
    return () => handleSearch.cancel();
  }, [searchTerm, produits, handleSearch]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProduits.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProduits.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="page-container">
      <Navigation />

      <header className="shop-header">
        <h1 className="shop-title">
          <FontAwesomeIcon icon={faLeaf} className="title-icon" />
          Notre Collection de Plantes
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
          <>
            <div className="products-grid">
              {currentProducts.map((produit) => (
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

            {/* Pagination */}
            {filteredProduits.length > PRODUCTS_PER_PAGE && (
              <nav className="pagination-container" aria-label="Pagination Navigation">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                  aria-label="Page précédente"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                  aria-label="Page suivante"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};



// CSS avec CSS Modules ou styled-components serait préférable, mais voici les styles améliorés
const styles = `
  .page-container {
    background-color: #f9f9f7;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .shop-header {
    text-align: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
    color: white;
    margin-bottom: 2rem;
  }

  .shop-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 300;
  }

  .title-icon {
    margin-right: 15px;
    color: #b7e4c7;
  }

  .search-container {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #95d5b2;
  }

  .search-input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    border-radius: 30px;
    border: none;
    font-size: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.3);
  }

  .shop-main-content {
    flex: 1;
    padding: 0 2rem;
  }

  .loading-container, .error-container, .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
  }

  .error-message {
    color: #d32f2f;
    margin-bottom: 1rem;
  }

  .retry-button {
    background-color: #2d6a4f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .retry-button:hover {
    background-color: #1b4332;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }

  .product-card.hovered {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  .product-image-container {
    position: relative;
    height: 250px;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .product-card.hovered .product-image {
    transform: scale(1.05);
  }

  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(45, 106, 79, 0.85);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .product-card.hovered .product-overlay {
    opacity: 1;
  }

  .add-to-cart-btn {
    background: #ffffff;
    color: #2d6a4f;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  .add-to-cart-btn:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }

  .product-details {
    padding: 1.2rem;
  }

  .product-name {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
  }

  .product-category {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .product-price {
    font-size: 1.2rem;
    color: #2d6a4f;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  .quick-view-btn {
    background: none;
    border: 1px solid #2d6a4f;
    color: #2d6a4f;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .quick-view-btn:hover {
    background-color: #2d6a4f;
    color: white;
  }

  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
      padding: 0 1rem;
    }

    .shop-title {
      font-size: 2rem;
    }

    .shop-main-content {
      padding: 0 1rem;
    }
  }

  @media (max-width: 480px) {
    .products-grid {
      grid-template-columns: 1fr;
    }

    .shop-title {
      font-size: 1.8rem;
    }
  }
`;

// Injection des styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default Boutique;
















