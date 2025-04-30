import React, { useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch } from 'react-icons/bi';

const ListeUtilisateurs = ({ 
  utilisateurs = [], 
  onViewDetails, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = utilisateurs.filter(user => {
    if (!user) return false;
    
    const searchText = searchTerm.toLowerCase();
    return (
      (user.nom || '').toLowerCase().includes(searchText) ||
      (user.prenom || '').toLowerCase().includes(searchText) ||
      (user.email || '').toLowerCase().includes(searchText) ||
      (user.role || '').toLowerCase().includes(searchText) ||
      (user.id || '').toString().includes(searchText)
    );
  });

  if (utilisateurs.length === 0) {
    return (
      <div className="users-list-container">
        <Alert variant="info">
          Aucun utilisateur trouvé.
        </Alert>
        <Button variant="primary" onClick={onAddUser}>
          Ajouter un utilisateur
        </Button>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <h2>Gestion des Utilisateurs</h2>
      
      <div className="list-actions">
        <div className="search-container">
          <BiSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Rechercher par nom, email, rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="success" onClick={onAddUser}>
          <BiEdit /> Ajouter utilisateur
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
        <Alert variant="warning">
          Aucun utilisateur ne correspond à votre recherche.
        </Alert>
      ) : (
        <Table responsive hover className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom || '-'}</td>
                <td>{user.prenom || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role || 'Non défini'}
                  </span>
                </td>
                <td className="actions-cell">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => onViewDetails(user)}
                    title="Voir détails"
                  >
                    <BiShow />
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    onClick={() => onEditUser(user)}
                    title="Modifier"
                  >
                    <BiEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => onDeleteUser(user.id)}
                    title="Supprimer"
                  >
                    <BiTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListeUtilisateurs;