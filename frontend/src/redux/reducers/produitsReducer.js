const initialProduitsState = [];

const produitsReducer = (state = initialProduitsState, action) => {
  switch (action.type) {
    case 'DEFINIR_PRODUITS':
      return action.payload;
    case 'AJOUTER_PRODUIT':
      return [...state, action.payload];
    case 'SUPPRIMER_PRODUIT':
      return state.filter(p => p.id !== action.payload);
    default:
      return state;
  }
};

export default produitsReducer;