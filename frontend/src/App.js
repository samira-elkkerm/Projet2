// src/App.js
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Provider } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import store from "./redux/store";
import ProtectedRoute from "./composants/ProtectedRoute";

import Accueil from "./composants/Client/Accueil";
import Boutique from "./composants/Client/Boutique";
import Produits from "./composants/Client/Produits";
import Produit from "./composants/Client/Produit";
import Contact from "./composants/Client/Contact";
import Panier from "./composants/Client/Panier";
import Connecter from "./composants/Connecter";
import Inscrire from "./composants/Inscrire";
import ForgotPassword from "./composants/ForgotPassword";
import ResetPassword from "./composants/ResetPassword";
import TableauBord from "./composants/Admin/TableauBord";
import GestionCommandes from "./composants/Admin/GestionCommandes";
import GestionUtilisateurs from "./composants/Admin/Utilisateurs/GestionUtilisateurs";
import GestionProduits from "./composants/Admin/Produits/GestionProduits";
import GestionPaiement from "./composants/Admin/GestionPaiement";
import ValiderCommande from "./composants/Client/ValiderCommande";
import GestionCategories from "./composants/Admin/GestionCategories";
import DetailProduit from "./composants/Client/DetailProduit";

const App = () => (
  <Provider store={store}>
    <Routes>

      <Route path="/" element={<Accueil />} />
      <Route path="/Boutique" element={<Boutique />} />
      <Route path="/Produits" element={<Produits />} />
      <Route path="/Produits/:id" element={<Produit />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Panier" element={<Panier />} />
      <Route path="/Valider_Commande" element={<ValiderCommande />} />
      <Route path="/produit/:id" element={<DetailProduit />} />

      <Route path="/Connecter" element={<Connecter />} />
      <Route path="/Inscrire" element={<Inscrire />} />
      <Route path="/Forgot-Password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/Admin/TableauBord"
        element={
          <ProtectedRoute requiredRole="admin">
            <TableauBord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/GestionCommandes"
        element={
          <ProtectedRoute requiredRole="admin">
            <GestionCommandes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/GestionUtilisateurs"
        element={
          <ProtectedRoute requiredRole="admin">
            <GestionUtilisateurs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/GestionProduits"
        element={
          <ProtectedRoute requiredRole="admin">
            <GestionProduits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/GestionPaiement"
        element={
          <ProtectedRoute requiredRole="admin">
            <GestionPaiement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/GestionCategories"
        element={
          <ProtectedRoute requiredRole="admin">
            <GestionCategories />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Provider>
);

export default App;
