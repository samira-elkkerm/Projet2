import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../../layout/MenuAdmin';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow } from 'react-icons/bi';
import AjoutUtilisateur from './AjoutUtilisateur';
import ModifierUtilisateur from './ModifierUtilisateur';
import DetailsUtilisateur from './DetailsUtilisateur';

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/users');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || !data.users) {
        throw new Error('Réponse API invalide');
      }

      setUsers(data.users);
      
    } catch (err) {
      console.error("Erreur API:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    return (
      user.nom.toLowerCase().includes(searchTerm) ||
      user.prenom.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.telephone.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.Statut.toLowerCase().includes(searchTerm)
    );
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setUsers(users.filter(user => user.id !== userToDelete.id));
      setSuccessMessage('Utilisateur supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setSuccessMessage('Utilisateur ajouté avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowEditModal(false);
    setSuccessMessage('Utilisateur mis à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Gestion des Utilisateurs</h2>

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
                placeholder="Rechercher par nom, email, téléphone, rôle ou statut..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <BiPlus /> Ajouter utilisateur
            </Button>
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.thCell}>ID</th>
                  <th style={styles.thCell}>Nom</th>
                  <th style={styles.thCell}>Prénom</th>
                  <th style={styles.thCell}>Email</th>
                  <th style={styles.thCell}>Téléphone</th>
                  <th style={styles.thCell}>Rôle</th>
                  <th style={styles.thCell}>Statut</th>
                  <th style={styles.thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tdCell}>{user.id}</td>
                      <td style={styles.tdCell}>{user.nom}</td>
                      <td style={styles.tdCell}>{user.prenom}</td>
                      <td style={styles.tdCell}>{user.email}</td>
                      <td style={styles.tdCell}>{user.telephone}</td>
                      <td style={styles.tdCell}>
                        <span style={getRoleStyle(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td style={styles.tdCell}>
                        <span style={getStatusStyle(user.Statut)}>
                          {user.Statut}
                        </span>
                      </td>
                      <td style={{...styles.tdCell, ...styles.actionsCell}}>
                        <Button 
                          variant="outline-success"  
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleDetailsClick(user)}
                        >
                          <BiShow />
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleEditClick(user)}
                          disabled={user.role === 'client'}
                        >
                          <BiEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          style={styles.iconButton}
                          onClick={() => handleDeleteClick(user)}
                        >
                          <BiTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <AjoutUtilisateur 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <>
          <ModifierUtilisateur 
            show={showEditModal} 
            onHide={() => setShowEditModal(false)} 
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
          />
          
          <DetailsUtilisateur
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            user={selectedUser}
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.prenom} {userToDelete?.nom} ?
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

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px',
    textTransform: 'capitalize'
  };

  switch (status) {
    case 'actif':
      return { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' };
    case 'inactif':
      return { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
};

const getRoleStyle = (role) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px',
    textTransform: 'capitalize'
  };

  switch (role) {
    case 'admin':
      return { ...baseStyle, backgroundColor: '#e6f0ff', color: '#007bff' };
    case 'client':
      return { ...baseStyle, backgroundColor: '#fff8e6', color: '#ffc107' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
};

export default GestionUtilisateurs;