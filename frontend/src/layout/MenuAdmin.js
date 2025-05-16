import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import tudert from "../Images/tudert.png";

const SidebarMenu = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div style={styles.sidebar}>
      {/* Logo et profil */}
      <div style={styles.headerContainer}>
        <img
          src={tudert}
          alt="Tudert logo"
          className="logo"
          style={{ width: "200px", height: "200px" }}
        />
      </div>
      
      {/* Menu */}
      <ul style={styles.menuList}>
        <li style={styles.menuItem}>
          <Link
            to="/Admin/TableauBord"
            style={activeItem === 'dashboard' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('dashboard')}
          >
            Tableau De Bord
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/GestionProduits"
            style={activeItem === 'products' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('products')}
          >
            Gestion Des Produits
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/GestionCommandes"
            style={activeItem === 'orders' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('orders')}
          >
            Gestion des Commandes
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/GestionUtilisateurs"
            style={activeItem === 'users' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('users')}
          >
            Gestion D'utilisateurs
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/GestionCategories" // Remplacez par votre route si disponible
            style={activeItem === 'Categories' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('Categories')}
          >
            Gestion De Categories
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/GestionPaiement"
            style={activeItem === 'payment' ? styles.activeMenuLink : styles.menuLink}
            onClick={() => handleItemClick('payment')}
          >
            Gestion Des Paiements
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="#logout" // Remplacez par votre route de déconnexion
            style={styles.menuLink}
          >
            Déconnexion
          </Link>
        </li>
      </ul>
    </div>
  );
};

// Styles CSS interne
const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '25%',
    height: '100vh',
    backgroundColor: '#0B1E0F',
    color: 'white',
    padding: '0',
    overflowY: 'auto'
  },
  headerContainer: {
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  profileInfo: {
    marginTop: '10px'
  },
  welcomeText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'normal'
  },
  menuList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  menuItem: {
    // Pas de bordure entre les éléments
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontSize: '18px',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      textDecoration: 'none'
    }
  },
  activeMenuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    color: '#46A358',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  menuIcon: {
    marginRight: '15px',
    fontSize: '18px',
    color: 'white'
  }
};

export default SidebarMenu;