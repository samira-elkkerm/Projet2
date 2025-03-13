export const ajouterAuPanier = (produit) => ({ type: 'AJOUTER_AU_PANIER', payload: produit });
export const retirerDuPanier = (id) => ({ type: 'RETIRER_DU_PANIER', payload: id });
export const viderPanier = () => ({ type: 'VIDER_PANIER' });