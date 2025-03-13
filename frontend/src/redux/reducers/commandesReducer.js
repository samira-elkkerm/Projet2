const initialCommandesState = [];

const commandesReducer = (state = initialCommandesState, action) => {
  switch (action.type) {
    case 'AJOUTER_COMMANDE':
      return [...state, action.payload];
    case 'SUPPRIMER_COMMANDE':
      return state.filter(commande => commande.id !== action.payload);
    case 'METTRE_A_JOUR_STATUT_COMMANDE':
      return state.map(cmd => cmd.id === action.payload.id ? { ...cmd, statut: action.payload.statut } : cmd);
    default:
      return state;
  }
};

export default commandesReducer;