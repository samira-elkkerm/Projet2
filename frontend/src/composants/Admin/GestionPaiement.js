import React, { useState } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch } from 'react-icons/bi';

const GestionPaiement = () => {
  // Données de démonstration
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Gestion De Paiement</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, date ou statut..."
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.thCell}>ID</th>
                  <th style={styles.thCell}>Nom Util</th>
                  <th style={styles.thCell}>Date</th>
                  <th style={styles.thCell}>Quantité</th>
                  <th style={styles.thCell}>Montant</th>
                  <th style={styles.thCell}>Status</th>
                  <th style={styles.thCell}>Action</th>
                </tr>
              </thead>
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
    minWidth: '80px'
  };

  switch (status) {
    case 'Livrée':
      return { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' };
    case 'En cours':
      return { ...baseStyle, backgroundColor: '#fff8e6', color: '#ffc107' };
    case 'Annulée':
      return { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
};

export default GestionPaiement;