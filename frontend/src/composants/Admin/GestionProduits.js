import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form, Image } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch } from 'react-icons/bi';
import axios from 'axios';

const GestionProduits = () => { 
  const [produites, setProduites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProduites();
  }, []);

  const fetchProduites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/produites'); // CORRIGÉ: endpoint api/produites
      const produitesFromDB = response.data;
      setProduites(produitesFromDB);
    } catch (error) {
      console.error('Erreur lors du chargement des produites depuis la base de données :', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === '') {
      fetchProduites(); 
    } else {
      const filtered = produites.filter(p =>
        p.nom.toLowerCase().includes(value) || p.description.toLowerCase().includes(value)
      );
      setProduites(filtered);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Produits</h2> {/* Titre aussi corrigé */}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher une produite..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
            <Button variant="success">+ Ajouter Produit</Button> {/* bouton aussi */}
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.thCell}>ID</th>
                  <th style={styles.thCell}>Image</th>
                  <th style={styles.thCell}>Produit</th>
                  <th style={styles.thCell}>Catégorie</th>
                  <th style={styles.thCell}>Date</th>
                  <th style={styles.thCell}>Prix</th>
                  <th style={styles.thCell}>Quantité</th>
                  <th style={styles.thCell}>Statut</th>
                  <th style={styles.thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produites.length > 0 ? (
                  produites.map((produite) => (
                    <tr key={produite.id} style={styles.tableRow}>
                      <td style={styles.tdCell}>{produite.id}</td>
                      <td style={styles.tdCell}>
                      <Image src={`http://127.0.0.1:8000/images/${produite.image}`} width={60} height={60} rounded />                     
                      </td>
                      <td style={styles.tdCell}>{produite.nom}</td>
                      <td style={styles.tdCell}>{produite.id_categorie}</td>
                      <td style={styles.tdCell}>{produite.date}</td>
                      <td style={styles.tdCell}>{parseFloat(produite.prix).toFixed(2)} DH</td>
                      <td style={styles.tdCell}>{produite.quantité}</td>
                      <td style={styles.tdCell}>
                        <span style={getStockStyle(produite.quantité)}>
                          {produite.quantité > 0 ? 'En Stock' : 'Rupture'}
                        </span>
                      </td>
                      <td style={{ ...styles.tdCell, ...styles.actionsCell }}>
                        <Button variant="outline-success" size="sm" style={styles.iconButton}>
                          <BiShow />
                        </Button>
                        <Button variant="outline-danger" size="sm" style={styles.iconButton}>
                          <BiTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucune produite trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContent: {
    width: '80%',
    marginLeft: '25%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  contentWrapper: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa'
  },
  searchContainer: {
    position: 'relative',
    width: '50%'
  },
  searchIcon: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: '#6c757d'
  },
  searchInput: {
    paddingLeft: '35px',
    borderRadius: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  title: {
    color: '#0B1E0F',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600'
  },
  tableHeader: {
    backgroundColor: '#f1f3f5',
    borderBottom: '1px solid #dee2e6'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6'
  },
  thCell: {
    padding: '16px 12px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#495057'
  },
  tdCell: {
    padding: '14px 12px',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  iconButton: {
    width: '32px',
    height: '32px',
    padding: '0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const getStockStyle = (quantité) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  };

  return quantité > 0
    ? { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' } // Vert pour "En Stock"
    : { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' }; // Rouge pour "Rupture"
};

export default GestionProduits;
