import { createStore, combineReducers, applyMiddleware  } from 'redux';
import {thunk} from "redux-thunk";
import produitsReducer from './reducers/produitsReducer';
import utilisateursReducer from './reducers/utilisateursReducer';
import panierReducer from './reducers/panierReducer';
import commandesReducer from './reducers/commandesReducer';
import categoriesReducer from './reducers/categoriesReducer';


// Combinaison des reducers
const rootReducer = combineReducers({
  produits: produitsReducer,
  produit: produitsReducer,
  utilisateurs: utilisateursReducer,
  panier: panierReducer,
  commandes: commandesReducer,
  categories:categoriesReducer,
  
});

// Création du store Redux
const store = createStore(rootReducer,applyMiddleware(thunk));

export default store;