import api from "../../api";

export const definirCategories = (categories) => ({
  type: 'DEFINIR_CATEGORIES',
  payload: categories
});

export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      const response = await api.get('/categories'); // Assure-toi que cette route existe
      console.log("Catégories récupérées :", response.data); // Debugging

      dispatch(definirCategories(response.data));
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories', error);
    }
  };
};
