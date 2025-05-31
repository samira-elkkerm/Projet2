import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { BiShow, BiSearch } from 'react-icons/bi';

const GestionPaiement = () => {
  const [paiements, setPaiements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/commandes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.commandes) {
          throw new Error('Réponse API invalide');
        }

        const formattedPaiements = data.commandes.map(commande => ({
          id: commande.id,
          numero_commande: commande.numero_commande,
          utilisateur: `${commande.prenom} ${commande.nom}`,
          montant: commande.total,
          statut: commande.statut === 'Livre' ? 'Payé' : 'Non payé',
          date: new Date(commande.created_at).toLocaleDateString('fr-FR'),
          email: commande.email,
          telephone: commande.telephone,
          adresse: commande.adress,
          ville: commande.ville,
          methode_paiement: commande.methode_paiement || 'Non spécifiée'
        }));

        setPaiements(formattedPaiements);
      } catch (err) {
        console.error("Erreur API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredPaiements = paiements.filter(paiement => {
    return (
      paiement.numero_commande.toLowerCase().includes(searchTerm) ||
      paiement.utilisateur.toLowerCase().includes(searchTerm) ||
      paiement.statut.toLowerCase().includes(searchTerm)
    );
  });

  const handleShowDetails = (paiement) => {
    setSelectedPaiement(paiement);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarMenu />
        <div style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>Gestion De Paiement</h2>
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
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
            <h2 style={styles.title}>Gestion De Paiement</h2>
            <div className="alert alert-danger" role="alert">
              Erreur: {error}
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
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
          <h2 style={styles.title}>Gestion De Paiement</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher par numéro de commande, nom ou statut..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.thCell}>ID Commande</th>
                  <th style={styles.thCell}>Utilisateur</th>
                  <th style={styles.thCell}>Montant payé</th>
                  <th style={styles.thCell}>Statut</th>
                  <th style={styles.thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaiements.length > 0 ? (
                  filteredPaiements.map((paiement, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tdCell}>{paiement.numero_commande}</td>
                      <td style={styles.tdCell}>{paiement.utilisateur}</td>
                      <td style={styles.tdCell}>{paiement.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
                      <td style={styles.tdCell}>
                        <span style={getPaiementStatusStyle(paiement.statut)}>
                          {paiement.statut}
                        </span>
                      </td>
                      <td style={{ ...styles.tdCell, ...styles.actionsCell }}>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          style={styles.iconButton} 
                          onClick={() => handleShowDetails(paiement)}
                          title="Voir détails"
                        >
                          <BiShow />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="alert alert-info mb-0">
                        Aucun paiement trouvé
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal pour afficher les détails du paiement */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du paiement - {selectedPaiement?.numero_commande}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPaiement && (
            <div className="row">
              <div className="col-md-6">
                <h5 className="fw-bold mb-3">Informations de paiement</h5>
                <div className="mb-3">
                  <p className="mb-1"><strong>Statut:</strong></p>
                  <span style={getPaiementStatusStyle(selectedPaiement.statut)}>
                    {selectedPaiement.statut}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Montant:</strong></p>
                  <p>{selectedPaiement.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Méthode de paiement:</strong></p>
                  <p>{selectedPaiement.methode_paiement}</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Date:</strong></p>
                  <p>{selectedPaiement.date}</p>
                </div>
              </div>
              <div className="col-md-6">
                <h5 className="fw-bold mb-3">Informations client</h5>
                <div className="mb-3">
                  <p className="mb-1"><strong>Nom:</strong></p>
                  <p>{selectedPaiement.utilisateur}</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Email:</strong></p>
                  <p>{selectedPaiement.email}</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Téléphone:</strong></p>
                  <p>{selectedPaiement.telephone}</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Adresse:</strong></p>
                  <p>{selectedPaiement.adresse}, {selectedPaiement.ville}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getPaiementStatusStyle = (status) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px'
  };

  switch (status.toLowerCase()) {
    case 'payé':
      return { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' };
    case 'non payé':
      return { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
    case 'en attente':
      return { ...baseStyle, backgroundColor: '#fff8e6', color: '#ffc107' };
    case 'annulé':
      return { ...baseStyle, backgroundColor: '#f0f0f0', color: '#6c757d' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
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

export default GestionPaiement;