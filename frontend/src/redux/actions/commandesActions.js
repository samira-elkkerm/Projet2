export const ajouterCommande = (commande) => ({ type: 'AJOUTER_COMMANDE', payload: commande });
export const supprimerCommande = (id) => ({ type: 'SUPPRIMER_COMMANDE', payload: id });
export const mettreAJourStatutCommande = (id, statut) => ({ type: 'METTRE_A_JOUR_STATUT_COMMANDE', payload: { id, statut } });