import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  InboxOutlined, 
  UserOutlined, 
  AppstoreOutlined,
  CreditCardOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import tudert from "../Images/tudert.png";

const SidebarMenu = () => {
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();

  // Détermine l'élément actif en fonction de l'URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('TableauBord')) setActiveItem('dashboard');
    else if (path.includes('GestionProduits')) setActiveItem('products');
    else if (path.includes('GestionCommandes')) setActiveItem('orders');
    else if (path.includes('GestionUtilisateurs')) setActiveItem('users');
    else if (path.includes('GestionCategories')) setActiveItem('categories');
    else if (path.includes('GestionPaiement')) setActiveItem('payment');
  }, [location]);

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Tableau De Bord',
      icon: <DashboardOutlined style={styles.menuIcon} />,
      path: '/Admin/TableauBord'
    },
    {
      key: 'products',
      label: 'Gestion Des Produits',
      icon: <ShoppingOutlined style={styles.menuIcon} />,
      path: '/GestionProduits'
    },
    {
      key: 'orders',
      label: 'Gestion des Commandes',
      icon: <InboxOutlined style={styles.menuIcon} />,
      path: '/GestionCommandes'
    },
    {
      key: 'users',
      label: "Gestion D'utilisateurs",
      icon: <UserOutlined style={styles.menuIcon} />,
      path: '/GestionUtilisateurs'
    },
    {
      key: 'categories',
      label: 'Gestion De Catégories',
      icon: <AppstoreOutlined style={styles.menuIcon} />,
      path: '/GestionCategories'
    },
    {
      key: 'payment',
      label: 'Gestion Des Paiements',
      icon: <CreditCardOutlined style={styles.menuIcon} />,
      path: '/GestionPaiement'
    },
    {
      key: 'logout',
      label: 'Déconnexion',
      icon: <LogoutOutlined style={styles.menuIcon} />,
      path: '/logout'
    }
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.headerContainer}>
        <img
          src={tudert}
          alt="Tudert logo"
          style={styles.logo}
        />
      </div>
      
      {/* Menu */}
      <ul style={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.key} style={styles.menuItem}>
            <Link
              to={item.path}
              style={activeItem === item.key ? styles.activeMenuLink : styles.menuLink}
              onClick={() => item.key !== 'logout' && setActiveItem(item.key)}
            >
              {item.icon}
              <span style={styles.menuText}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Styles CSS
const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '25%',
    height: '100vh',
    backgroundColor: '#0B1E0F',
    color: 'white',
    padding: '20px 0',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  headerContainer: {
    padding: '0 20px 20px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '20px'
  },
  logo: {
    width: '180px',
    height: 'auto',
    objectFit: 'contain'
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  menuItem: {
    margin: '5px 0',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.05)'
    }
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 25px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontSize: '15px',
    ':hover': {
      color: '#46A358',
      backgroundColor: 'rgba(255,255,255,0.05)'
    }
  },
  activeMenuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 25px',
    color: '#46A358',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: 'rgba(70, 163, 88, 0.1)',
    borderLeft: '3px solid #46A358'
  },
  menuIcon: {
    fontSize: '18px',
    marginRight: '15px',
    color: 'inherit'
  },
  menuText: {
    flex: 1
  }
};

export default SidebarMenu;