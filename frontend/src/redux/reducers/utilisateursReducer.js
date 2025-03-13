const initialUtilisateursState = { utilisateurActuel: null };

const utilisateursReducer = (state = initialUtilisateursState, action) => {
  switch (action.type) {
    case 'DEFINIR_UTILISATEUR':
      return { utilisateurActuel: action.payload };
    case 'DECONNECTER_UTILISATEUR':
      return { utilisateurActuel: null };
    default:
      return state;
  }
};