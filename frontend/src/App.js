import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Accueil from './composants/Accueil';

const App = () => (
  <Provider store={store}>
    <Accueil />
  </Provider>
);

export default App;

