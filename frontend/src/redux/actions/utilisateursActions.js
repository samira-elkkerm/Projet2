import api from "../../api";

export const definirUtilisateur = (utilisateur) => ({ type: 'DEFINIR_UTILISATEUR', payload: utilisateur });
export const modifierUtilisateur = (utilisateur) => ({ type: 'MODIFIER_UTILISATEUR', payload: utilisateur });
export const deconnecterUtilisateur = () => ({ type: 'DECONNECTER_UTILISATEUR' });

export const fetchUtilisateur = (id) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/users/${id}`);
      console.log("Utilisateur récupérée :", response.data); // Debugging
      dispatch(definirUtilisateur(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération d'utilisateur", error);
    }
  };
};

export const modiferProfil = (id, data) => {
  return async (dispatch) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      console.log("Profil modifiée :", response.data);
      dispatch(modifierUtilisateur(response.data));
    } catch (error) {
      console.log("Erreur lors de la modification du profil", error);
    }
  }
}