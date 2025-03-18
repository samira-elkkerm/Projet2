import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import store from './redux/store';
import Navigation from './layout/Navigation';
import Accueil from './composants/Client/Accueil';
import Boutique from './composants/Client/Boutique';
import Contact from './composants/Client/Contact';
import Panier from './composants/Client/Panier';
import Connecter from './composants/Client/Connecter'; 
import Inscrire from './composants/Client/Inscrire';   
import TableauBord from './composants/Admin/TableauBord';
import GestionCommandes from './composants/Admin/GestionCommandes';
import GestionUtilisateur from './composants/Admin/GestionUtilisateur';
import GestionProduits from './composants/Admin/GestionProduits';
import GestionPaiement from './composants/Admin/GestionPaiement';


import './App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => (
  <Provider store={store}>
    <>
      <Navigation />
      <Routes>
        
        <Route path="/" element={<Accueil />} />
        <Route path="/Boutique" element={<Boutique />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Panier" element={<Panier />} />

        
        <Route path="/Connecter" element={<Connecter />} />
        <Route path="/Inscrire" element={<Inscrire />} />

        
        <Route path="/TableauBord" element={<TableauBord />} />
        <Route path="/GestionCommandes" element={<GestionCommandes />} />
        <Route path="/GestionUtilisateur" element={<GestionUtilisateur />} />
        <Route path="/GestionProduits" element={<GestionProduits />} />
        <Route path="/GestionPaiement" element={<GestionPaiement />} />

        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </>
  </Provider>
);

export default App;

