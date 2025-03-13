export const definirProduits = (produits) => ({ type: 'DEFINIR_PRODUITS', payload: produits });
export const ajouterProduit = (produit) => ({ type: 'AJOUTER_PRODUIT', payload: produit });
export const supprimerProduit = (id) => ({ type: 'SUPPRIMER_PRODUIT', payload: id });