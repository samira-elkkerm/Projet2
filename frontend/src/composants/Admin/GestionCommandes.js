import React, { useState } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch } from 'react-icons/bi';

const GestionCommandes = () => {
  // Données de démonstration
  const initialCommandes = [
    { id: 'C.001', nom: 'Ahmed', date: '01/12/2025', qte: 11, montant: 20000.00, status: 'Annulée' },
    { id: 'C.002', nom: 'Karima', date: '02/12/2025', qte: 5, montant: 15000.00, status: 'Livrée' },
    { id: 'C.003', nom: 'Mohamed', date: '03/12/2025', qte: 8, montant: 18000.00, status: 'En cours' },
    { id: 'C.004', nom: 'Fatima', date: '04/12/2025', qte: 3, montant: 7500.00, status: 'Annulée' },
    { id: 'C.005', nom: 'Youssef', date: '05/12/2025', qte: 15, montant: 30000.00, status: 'Livrée' },
  ];

  const [commandes, setCommandes] = useState(initialCommandes);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setCommandes(initialCommandes);
      return;
    }

    const filtered = initialCommandes.filter(commande => {
      return (
        commande.nom.toLowerCase().includes(term) ||
        commande.date.includes(term) ||
        commande.status.toLowerCase().includes(term)
      );
    });

    setCommandes(filtered);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Commandes</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, date ou statut..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
            <Button variant="success">+ Ajouter commande</Button>
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
              <tbody>
                {commandes.length > 0 ? (
                  commandes.map((commande, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tdCell}>{commande.id}</td>
                      <td style={styles.tdCell}>{commande.nom}</td>
                      <td style={styles.tdCell}>{commande.date}</td>
                      <td style={styles.tdCell}>{commande.qte}</td>
                      <td style={styles.tdCell}>{commande.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
                      <td style={styles.tdCell}>
                        <span style={getStatusStyle(commande.status)}>
                          {commande.status}
                        </span>
                      </td>
                      <td style={{...styles.tdCell, ...styles.actionsCell}}>
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
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucune commande trouvée
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

export default GestionCommandes;