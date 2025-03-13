const initialPanierState = [];

const panierReducer = (state = initialPanierState, action) => {
  switch (action.type) {
    case 'AJOUTER_AU_PANIER':
      return [...state, action.payload];
    case 'RETIRER_DU_PANIER':
      return state.filter(item => item.id !== action.payload);
    case 'VIDER_PANIER':
      return [];
    default:
      return state;
  }
};

export default panierReducer;