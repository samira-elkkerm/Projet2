import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduits } from '../../redux/actions/produitsActions';
import '../../App.css';
import { Link } from 'react-router-dom';

const ListProduits = () => {
  const [produites, setProduites] = useState([]);
  
  useEffect(() => {
      const fetchPanier = async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/produites"
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setProduites(data.produites);
        } catch (error) {
          console.error("Error fetching panier data:", error);
        }
      };
  
      fetchPanier();
    }, []);
  return (
    <div className=" container produits-grid" style={{marginLeft:'400px'}}>
               {produites.slice(-8).map((produit) => (
                 <div
                   key={produit.id}
                   className="produit-card"
                 >
                   <div className="produit-image-container">
                     <img
                       src={`http://127.0.0.1:8000/images/${produit.image}`}
                       alt={produit.nom}
                       className="produit-image"
                     />
                   </div>
                   <div className="produit-details">
                     <h3 className="produit-nom">{produit.nom}</h3>
                     <p className="produit-prix">{produit.prix} DH</p>
                   </div>
                 </div>
               ))}
             </div>
  );
};

export default ListProduits;