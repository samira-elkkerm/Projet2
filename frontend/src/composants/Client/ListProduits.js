import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduits } from "../../redux/actions/produitsActions";
import "../../App.css";
import { Link } from "react-router-dom";

const ListProduits = () => {
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
    <div className="produits">
        {produites && produites.length > 0 ? (
          produites.sort(() => Math.random() - 0.5).map((produit) => (
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
