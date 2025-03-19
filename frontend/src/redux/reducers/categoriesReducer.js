const initialState = {
  categories: [],
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DEFINIR_CATEGORIES':
      return {
        ...state,  // On garde les autres propriétés du state inchangées
        categories: action.payload,  // On met à jour seulement categories
      };
    default:
      return state;
  }
};

export default categoriesReducer;
