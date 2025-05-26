import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Table, Alert, Row, Col, Card } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { FaCheckCircle, FaTimesCircle, FaTruck, FaClipboardList } from 'react-icons/fa';

const DetailsUtilisateur = ({ user, show, onHide }) => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCommandes = async () => {
    if (!user?.id || user.role !== 'client') return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/commandes?user_id=${user.id}&timestamp=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && Array.isArray(data.commandes)) {
        const userCommandes = data.commandes.filter(cmd => 
          cmd.user_id == user.id || cmd.utilisateur_id == user.id
        );
        setCommandes(userCommandes);
        
        if (userCommandes.length === 0) {
          setError('Aucune commande trouvée pour ce client');
        }
      } else {
        throw new Error('Format de données incorrect');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(`Erreur lors du chargement: ${err.message}`);
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      refreshCommandes();
    }
  }, [show, user]);

  const getStatus = (commande) => {
    if (!commande) return 'N/A';
    return commande.status || commande.statut || 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('livr')) {
      return { text: 'Livrée', class: 'bg-success' };
    }
    if (statusLower.includes('annul')) {
      return { text: 'Annulée', class: 'bg-danger' };
    }
    if (statusLower.includes('cours') || statusLower.includes('attente')) {
      return { text: 'En cours', class: 'bg-primary' };
    }
    return { text: status, class: 'bg-secondary' };
  };
  const totalCmd = commandes.length;
  const totalCost = commandes.reduce((sum, c) => sum + (parseFloat(c.total) || 0), 0);
  const livreeCount = commandes.filter(c => 
    getStatus(c).toLowerCase().includes('livr')
  ).length;
  const annuleeCount = commandes.filter(c => 
    getStatus(c).toLowerCase().includes('annul')
  ).length;
  const enCoursCount = totalCmd - livreeCount - annuleeCount;

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-0 px-4 py-3">
        <Modal.Title className="d-flex align-items-center">
          <Button
            variant="light"
            onClick={onHide}
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: 40, height: 40 }}
          >
            <BiArrowBack size={20} />
          </Button>
          <span className="fs-3 fw-bold">Détails de l'utilisateur</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ backgroundColor: '#f8f9fb' }}>
        <Row className="mb-4 g-4" style={{ alignItems: 'stretch' }}>
          <Col md={5} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-3"
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: '#46a358',
                    fontSize: 36,
                    userSelect: 'none',
                  }}
                >
                  {user.prenom?.charAt(0).toUpperCase()}
                  {user.nom?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold mb-1">{user.prenom} {user.nom}</h4>
                <p className="text-muted mb-3">
                  @{user.prenom?.toLowerCase()}{user.nom?.toLowerCase().substring(0, 3)}
                </p>

                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Téléphone" value={user.telephone || 'Non renseigné'} />
                <InfoRow label="Ville" value={user.ville || 'Non renseignée'} />
                <InfoRow label="Adresse" value={user.adress || 'Non renseignée'} />
                <InfoRow label="Statut" value={user.Statut || 'Non renseigné'} />
                <InfoRow label="Rôle" value={user.role || 'Non renseigné'} />
              </Card.Body>
            </Card>
          </Col>

          {user.role === 'client' && (
            <Col md={5} lg={5}>
              <Row className="g-3 h-100">
                <Col md={5}>
                  <StatBox 
                    label="Coût Total" 
                    value={`${totalCost.toFixed(2)} DH`} 
                    color="#46a358" 
                    icon={<FaClipboardList />}
                    secondaryText={`${totalCmd} commandes`}
                  />
                </Col>
                <Col md={5}>
                  <StatBox 
                    label="Commandes Livrées" 
                    value={livreeCount} 
                    color="#46a358" 
                    icon={<FaCheckCircle />}
                    percentage={totalCmd > 0 ? Math.round((livreeCount/totalCmd)*100) : 0}
                  />
                </Col>
                <Col md={5}>
                  <StatBox 
                    label="Commandes Annulées" 
                    value={annuleeCount} 
                    color="#e53e3e" 
                    icon={<FaTimesCircle />}
                    percentage={totalCmd > 0 ? Math.round((annuleeCount/totalCmd)*100) : 0}
                  />
                </Col>
                <Col md={5}>
                  <StatBox 
                    label="Commandes en Cours" 
                    value={enCoursCount} 
                    color="#3182CE" 
                    icon={<FaTruck />}
                    percentage={totalCmd > 0 ? Math.round((enCoursCount/totalCmd)*100) : 0}
                  />
                </Col>
              </Row>
            </Col>
          )}
        </Row>

        {user.role === 'client' && (
          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Historique des Commandes</h5>
                    <div className="d-flex">
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={refreshCommandes}
                        disabled={loading}
                      >
                        {loading ? 'Chargement...' : 'Rafraîchir'}
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="success" />
                      <p className="mt-2">Chargement des commandes...</p>
                    </div>
                  ) : error ? (
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>ID Commande</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commandes.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="text-center text-muted py-5">
                                <FaClipboardList size={22} className="mb-3" color="#46a358" />
                                <div className="fs-5">Aucune commande trouvée pour ce client</div>
                              </td>
                            </tr>
                          ) : (
                            commandes.map((commande) => {
                              const status = getStatus(commande);
                              const statusInfo = getStatusBadge(status);
                              
                              return (
                                <tr key={commande.id}>
                                  <td className="fw-semibold" style={{ color: '#46a358' }}>
                                    {commande.numero_commande || `CMD-${commande.id}`}
                                  </td>
                                  <td>
                                    {commande.date || 
                                     new Date(commande.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="fw-semibold">
                                    {parseFloat(commande.total || 0).toFixed(2)} DH
                                  </td>
                                  <td>
                                    <span className={`badge ${statusInfo.class} rounded-pill px-3 py-1`}>
                                      {statusInfo.text}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="d-flex justify-content-between align-items-center mb-2 w-100 px-2">
    <span className="fw-semibold text-secondary">{label}</span>
    <span className="text-dark fw-medium">{value}</span>
  </div>
);

const StatBox = ({ label, value, color, icon, percentage, secondaryText }) => (
  <Card className="h-100 border-0" style={{ backgroundColor: `${color}10` }}>
    <Card.Body className="p-3">
      <div className="d-flex align-items-center">
        <div className="me-3" style={{ color, fontSize: '1.75rem' }}>
          {icon}
        </div>
        <div>
          <div className="fw-bold fs-4" style={{ color }}>{value}</div>
          <div className="text-muted small">{label}</div>
          {percentage !== undefined && (
            <div className="text-muted small mt-1">
              <span className="fw-bold" style={{ color }}>{percentage}%</span> du total
            </div>
          )}
          {secondaryText && (
            <div className="text-muted small mt-1">{secondaryText}</div>
          )}
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default DetailsUtilisateur;