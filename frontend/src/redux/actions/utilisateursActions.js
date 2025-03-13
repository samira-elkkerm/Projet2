export const definirUtilisateur = (utilisateur) => ({ type: 'DEFINIR_UTILISATEUR', payload: utilisateur });
export const deconnecterUtilisateur = () => ({ type: 'DECONNECTER_UTILISATEUR' });