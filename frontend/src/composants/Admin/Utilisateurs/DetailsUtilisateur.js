import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsUtilisateur = ({ user, show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && user?.id) {
      // Chargement des données si nécessaire
      setLoading(false);
    }
  }, [show, user]);

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 px-4 py-3">
        <Modal.Title className="d-flex align-items-center">
          <Button 
            variant="light" 
            onClick={onHide} 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px',
              height: '40px',
              marginRight: '12px'
            }}
          >
            <BiArrowBack size={20} />
          </Button>
          <span className="fs-3 fw-bold">Détails de l'utilisateur</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="bg-white rounded-3 shadow-sm p-4 d-flex flex-column align-items-center">
          {/* Image de profil */}
          {user.image ? (
            <Image 
              src={`http://localhost:8000/storage/${user.image}`}
              roundedCircle
              width={100}
              height={100}
              className="mb-4"
              alt={`${user.prenom} ${user.nom}`}
            />
          ) : (
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-4"
              style={{ 
                width: '100px',
                height: '100px',
                backgroundColor: '#46a358',
                fontSize: '32px',
                userSelect: 'none',
              }}
            >
              {user.prenom.charAt(0).toUpperCase()}{user.nom.charAt(0).toUpperCase()}
            </div>
          )}

          <h4 className="fw-bold mb-1">{user.prenom} {user.nom}</h4>
          <p className="text-muted mb-3">@{user.prenom.toLowerCase()}{user.nom.toLowerCase().substring(0, 3)}</p>

          <div className="w-100">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Téléphone" value={user.telephone} />
            <InfoRow label="Ville" value={user.ville || 'Non renseignée'} />
            <InfoRow label="Adresse" value={user.adress || 'Non renseignée'} />
            <InfoRow label="Statut" value={user.Statut || 'Non renseigné'} />
            <InfoRow label="Rôle" value={user.role || 'Non renseigné'} />
            
            {/* Documents */}
            {user.documents && user.documents.length > 0 && (
              <div className="mt-3">
                <h6 className="fw-bold">Documents</h6>
                <div className="d-flex flex-wrap gap-2">
                  {user.documents.map((doc, index) => (
                    <Image 
                      key={index}
                      src={`http://localhost:8000/storage/${doc.path}`}
                      thumbnail
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      alt={`Document ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="d-flex justify-content-between align-items-center mb-2">
    <span className="fw-semibold text-secondary">{label} :</span>
    <span className="text-dark">{value}</span>
  </div>
);

export default DetailsUtilisateur;