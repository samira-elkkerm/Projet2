import api from "../../api";


export const definirProduits = (produits) => ({ type: 'DEFINIR_PRODUITS', payload: produits });
export const definirProduit = (produit) => ({ type: 'DEFINIR_PRODUIT', payload: produit });
export const ajouterProduit = (produit) => ({ type: 'AJOUTER_PRODUIT', payload: produit });
export const supprimerProduit = (id) => ({ type: 'SUPPRIMER_PRODUIT', payload: id });

export const fetchProduits = () => {
  return async (dispatch) => {
    try {
      const response = await api.get('/produits'); // Assure-toi que cette route existe
      console.log("Produits récupérées :", response.data); // Debugging

      dispatch(definirProduits(response.data));
    } catch (error) {
      console.error('Erreur lors de la récupération des produits', error);
    }
  };
};

export const fetchProduit = (id) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/produits/${id}`);
      console.log("Produit récupérée :", response.data); // Debugging
      dispatch(definirProduit(response.data));
    } catch (error) {
      console.error('Erreur lors de la récupération des produit', error);
    }
  };
};