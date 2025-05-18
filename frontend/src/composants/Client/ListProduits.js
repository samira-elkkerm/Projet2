import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";

const ListProduits = () => {
  const [produites, setProduites] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Nombre de produits par page

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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = produites.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(produites.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="produits-container">
      <div className="produits">
        {currentProducts && currentProducts.length > 0 ? (
          currentProducts.map((produit) => (
            <div 
              key={produit.id} 
              className="product-card"
              onMouseEnter={() => setHoveredProduct(produit.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link to={`/produit/${produit.id}`} className="text-decoration-none text-black">
                <div className="card-image" style={{ position: "relative" }}>
                  <img 
                    src={`http://127.0.0.1:8000/images/${produit.image}`} 
                    alt={produit.nom} 
                    className="product-image"
                  />
                </div>
                <div className="card-items">
                  <h3 className="card-title fs-4">{produit.nom}</h3>
                  <span className='card-text'>{produit.prix} MAD</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-products">Aucun produit disponible.</p>
        )}
      </div>

      {/* Pagination */}
      {produites.length > productsPerPage && (
        <div className="pagination-container">
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
        </div>
      )}
    </div>
  );
};

export default ListProduits;
