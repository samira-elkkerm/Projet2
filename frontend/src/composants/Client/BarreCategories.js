import '../../App.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../../redux/actions/categoriesActions';

const BarreCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id); // Met à jour la catégorie sélectionnée
  };

  return (
    <div className="container">
      <div className="categories">
        <h3 className="title-categories"><strong>Catégories</strong></h3>
        <ul>
          {categories && categories.length > 0 ? (
            categories.map((categorie) => (
              <li key={categorie.id}>
                <Link
                  to={`/boutique?categorie=${categorie.id}`}
                  style={{ textDecoration: 'none' }}
                  className={selectedCategory === categorie.id ? "selected" : ""}
                  onClick={() => handleCategoryClick(categorie.id)}
                >
                  {categorie.type}
                </Link>
              </li>
            ))
          ) : (
            <p>Aucune catégorie disponible.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BarreCategories;
