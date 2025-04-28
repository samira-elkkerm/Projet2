import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch } from 'react-icons/bi';

const GestionCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [groupedCommandes, setGroupedCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/commandes');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data || !data.commandes) {
          throw new Error('Réponse API invalide');
        }

        setCommandes(data.commandes);
        const grouped = groupByNumeroCommande(data.commandes);
        setGroupedCommandes(grouped);
        
      } catch (err) {
        console.error("Erreur API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const groupByNumeroCommande = (commandes) => {
    const grouped = {};
    
    commandes.forEach(commande => {
      if (!grouped[commande.numero_commande]) {
        grouped[commande.numero_commande] = {
          id: commande.numero_commande,
          nom: `${commande.prenom} ${commande.nom}`,
          date: new Date(commande.created_at).toLocaleDateString('fr-FR'),
          qte: commande.total_produits,
          montant: commande.total,
          status: commande.statut,
          commandesDetails: [commande]
        };
      } else {
        grouped[commande.numero_commande].qte += commande.total_produits;
        grouped[commande.numero_commande].montant += commande.total;
        grouped[commande.numero_commande].commandesDetails.push(commande);
      }
    });
    
    return Object.values(grouped);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      const grouped = groupByNumeroCommande(commandes);
      setGroupedCommandes(grouped);
      return;
    }

    const filtered = commandes.filter(commande => {
      return (
        commande.nom.toLowerCase().includes(term) ||
        commande.prenom.toLowerCase().includes(term) ||
        commande.numero_commande.toLowerCase().includes(term) ||
        new Date(commande.created_at).toLocaleDateString('fr-FR').includes(term) ||
        commande.statut.toLowerCase().includes(term)
      );
    });

    const groupedFiltered = groupByNumeroCommande(filtered);
    setGroupedCommandes(groupedFiltered);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarMenu />
        <div style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>Commandes</h2>
            <p>Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarMenu />
        <div style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>Commandes</h2>
            <div className="alert alert-danger">
              Erreur lors du chargement des commandes: {error}
            </div>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                placeholder="Rechercher par nom, numéro de commande, date ou statut..."
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
                  <th style={styles.thCell}>N° Commande</th>
                  <th style={styles.thCell}>Client</th>
                  <th style={styles.thCell}>Date</th>
                  <th style={styles.thCell}>Quantité</th>
                  <th style={styles.thCell}>Montant Total</th>
                  <th style={styles.thCell}>Statut</th>
                  <th style={styles.thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedCommandes.length > 0 ? (
                  groupedCommandes.map((commande, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tdCell}>{commande.id}</td>
                      <td style={styles.tdCell}>{commande.nom}</td>
                      <td style={styles.tdCell}>{commande.date}</td>
                      <td style={styles.tdCell}>{commande.qte}</td>
                      <td style={styles.tdCell}>{commande.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
                      <td style={styles.tdCell}>
                        <span style={getStatusStyle(commande.status)}>
                          {commande.status.replace('_', ' ')}
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
    minWidth: '80px',
    textTransform: 'capitalize'
  };

  switch (status) {
    case 'livrée':
      return { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' };
    case 'en_cours':
      return { ...baseStyle, backgroundColor: '#fff8e6', color: '#ffc107' };
    case 'en_attente':
      return { ...baseStyle, backgroundColor: '#e6f0ff', color: '#007bff' };
    case 'annulée':
      return { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
};

export default GestionCommandes;