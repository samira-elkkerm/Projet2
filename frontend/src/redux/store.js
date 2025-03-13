import { createStore, combineReducers } from 'redux';
import produitsReducer from './reducers/produitsReducer';
import utilisateursReducer from './reducers/utilisateursReducer';
import panierReducer from './reducers/panierReducer';
import commandesReducer from './reducers/commandesReducer';

// Combinaison des reducers
const rootReducer = combineReducers({
  produits: produitsReducer,
  utilisateurs: utilisateursReducer,
  panier: panierReducer,
  commandes: commandesReducer,
});

// Création du store Redux
const store = createStore(rootReducer);

export default store;