import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch, faSpinner, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const PRODUCTS_PER_PAGE = 9;

const ListProduits = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  // Chargement des produits avec pagination
  const fetchProduits = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/produites?page=${page}&per_page=${PRODUCTS_PER_PAGE}`
      );
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const data = await response.json();
      setProduits(data.data || data);
      setFilteredProduits(data.data || data);
      setTotalProducts(data.total || data.length);
      setCurrentPage(page);
    } catch (error) {
      setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduits(1);
  }, [fetchProduits]);

  // Recherche optimisée
  const handleSearch = debounce((term) => {
    if (!term) {
      fetchProduits(1);
      return;
    }
    
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/produites/search?q=${term}`)
      .then(res => res.json())
      .then(data => {
        setFilteredProduits(data);
        setTotalProducts(data.length);
        setCurrentPage(1);
      })
      .catch(err => setError("Erreur de recherche"))
      .finally(() => setIsLoading(false));
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
    return () => handleSearch.cancel();
  }, [searchTerm]);

  // Calcul de pagination
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProduits.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Navigation pagination
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    if (!searchTerm) fetchProduits(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage, endPage;

    if (totalPages <= maxVisibleButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const half = Math.floor(maxVisibleButtons / 2);
      if (currentPage <= half + 1) {
        startPage = 1;
        endPage = maxVisibleButtons;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - maxVisibleButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    // Bouton Première page
    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => paginate(1)} className="pagination-number">
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Boutons centraux
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    // Bouton Dernière page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      buttons.push(
        <button key={totalPages} onClick={() => paginate(totalPages)} className="pagination-number">
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="page-container">
      <main className="shop-main-content">
        

        {isLoading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Chargement des produits...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => fetchProduits(1)} className="retry-button">
              Réessayer
            </button>
          </div>
        ) : currentProducts.length === 0 ? (
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
                          onClick={() => navigate(`/produit/${produit.id}`)}
                          className="add-to-cart-btn"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} />
                          Voir détails
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{produit.nom}</h3>
                    {produit.categorie && (
                      <span className="product-category">{produit.categorie}</span>
                    )}
                    <p className="product-price">{produit.prix} DH</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination améliorée */}
            {totalPages > 1 && (
              <nav className="pagination-container" aria-label="Pagination Navigation">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                  aria-label="Page précédente"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {renderPaginationButtons()}

                <button
                  onClick={() => paginate(currentPage + 1)}
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
export default ListProduits;