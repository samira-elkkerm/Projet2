import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../../layout/MenuAdmin';
import { Table, Button, Form, Modal, Alert, Image } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch, BiEdit, BiPlus } from 'react-icons/bi';
import AjouterProduit from './AjouterProduit';
import ModifierProduit from './ModifierProduit';
import DetailsProduit from './DetailsProduit';

const GestionProduits = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, []);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/produites');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProduits(data);
      
    } catch (err) {
      console.error("Erreur API:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur de récupération des catégories:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id == id);
    return category ? category.type : 'Inconnue';
  };
  
  const filteredProduits = produits.filter(produit => {
    if (!searchTerm) return true;
  
    const term = searchTerm.toLowerCase();
  
    return (
      produit.nom.toLowerCase().includes(term) ||
      (produit.description && produit.description.toLowerCase().includes(term)) ||
      (produit.id_categorie && getCategoryName(produit.id_categorie).toLowerCase().includes(term)) ||
      (produit.prix && produit.prix.toString().toLowerCase().includes(term)) ||
      (produit.quantité && produit.quantité.toString().toLowerCase().includes(term)) ||
      (produit.created_at && produit.created_at.toString().toLowerCase().includes(term))
    );
  });
  const handleEditClick = (produit) => {
    setSelectedProduit(produit);
    setShowEditModal(true);
  };

  const handleDetailsClick = (produit) => {
    setSelectedProduit(produit);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (produit) => {
    setProduitToDelete(produit);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/produites/${produitToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setProduits(produits.filter(produit => produit.id !== produitToDelete.id));
      setSuccessMessage('Produit supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
      setProduitToDelete(null);
    }
  };

  const handleProduitAdded = (newProduit) => {
    setProduits([...produits, newProduit]);
    setShowAddModal(false);
    setSuccessMessage('Produit ajouté avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProduitUpdated = (updatedProduit) => {
    setProduits(produits.map(produit => 
      produit.id === updatedProduit.id ? updatedProduit : produit
    ));
    setShowEditModal(false);
    setSuccessMessage('Produit mis à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Gestion des Produits</h2>

          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, catégorie ou prix ..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <BiPlus /> Ajouter produit
            </Button>
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive style={styles.table}>
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
                {filteredProduits.length > 0 ? (
                  filteredProduits.map((produit) => (
                    <tr key={produit.id} style={styles.tableRow}>
                      <td style={styles.tdCell}>{produit.id}</td>
                      <td style={styles.tdCell}>
                        <Image 
                          src={`http://localhost:8000/images/${produit.image}`} 
                          width={60} 
                          height={60} 
                          rounded 
                        />
                      </td>
                      <td style={styles.tdCell}>{produit.nom}</td>
                      <td style={styles.tdCell}>{getCategoryName(produit.id_categorie)}</td>
                      <td style={styles.tdCell}>{produit.date}</td>
                      <td style={styles.tdCell}>{parseFloat(produit.prix).toFixed(2)} DH</td>
                      <td style={styles.tdCell}>{produit.quantité}</td>
                      <td style={styles.tdCell}>
                        <span style={getStockStyle(produit.quantité)}>
                          {produit.quantité > 0 ? 'En Stock' : 'Rupture'}
                        </span>
                      </td>
                      <td style={{...styles.tdCell, ...styles.actionsCell}}>
                        <Button 
                          variant="outline-success"  
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleDetailsClick(produit)}
                        >
                          <BiShow />
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleEditClick(produit)}
                        >
                          <BiEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleDeleteClick(produit)}
                        >
                          <BiTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                      {loading ? 'Chargement...' : 'Aucun produit trouvé'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <AjouterProduit 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onProduitAdded={handleProduitAdded}
        categories={categories}
      />

      {selectedProduit && (
        <>
          <ModifierProduit 
            show={showEditModal} 
            onHide={() => setShowEditModal(false)} 
            produit={selectedProduit}
            onProduitUpdated={handleProduitUpdated}
            categories={categories}
          />
          
          <DetailsProduit
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            produit={selectedProduit}
            getCategoryName={getCategoryName}
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le produit {produitToDelete?.nom} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
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
    width: '60%',
    marginRight: '15px'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    color: '#6c757d'
  },
  searchInput: {
    paddingLeft: '35px',
    borderRadius: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  title: {
    color: '#0B1E0F',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600'
  },
  table: {
    margin: '0 auto',
    width: '100%'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
    borderBottom: '1px solid #dee2e6'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  thCell: {
    padding: '16px 12px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#495057',
    border: 'none'
  },
  tdCell: {
    padding: '14px 12px',
    textAlign: 'center',
    verticalAlign: 'middle',
    border: 'none'
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '0',
    borderRadius: '50%'
  }
};

const getStockStyle = (quantité) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px',
    textTransform: 'capitalize'
  };

  return quantité > 0
    ? { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' }
    : { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
};

export default GestionProduits;