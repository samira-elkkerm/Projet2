import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/actions/categoriesActions';
import '../../App.css';

const BarreCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Assure-toi d'accéder au bon chemin dans le state

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="categories">
      <h3 className="title-categories"><strong>Catégories :</strong></h3>
      <ul>
        {categories && categories.length > 0 ? (
          categories.map((categorie) => (
            <li key={categorie.id}>
              
              {categorie.type} 
              
            </li>
          ))
        ) : (
          <p>Aucune catégorie disponible.</p>
        )}
      </ul>
    </div>
  );
};

export default BarreCategories;
