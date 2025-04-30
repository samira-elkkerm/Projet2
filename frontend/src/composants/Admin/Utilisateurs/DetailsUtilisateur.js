import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsUtilisateur = ({ user, show, onHide }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-0 px-4 py-3">
        <Modal.Title className="d-flex align-items-center">
          <Button 
            variant="light" 
            onClick={onHide} 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px',
              height: '40px',
              marginRight: '10px'
            }}
          >
            <BiArrowBack size={20} />
          </Button>
          <span className="fs-3 fw-bold">Détails de l'utilisateur</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="d-flex gap-4 mb-5">
          {/* User Profile Section */}
          <div className="d-flex flex-column justify-content-center align-items-center gap-4 bg-white p-4 rounded-3" 
               style={{ height: '343px', width: '519px' }}>
            
            <div className="d-flex align-items-center gap-5" style={{ width: '483px' }}>
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                style={{ 
                  width: '90px',
                  height: '90px',
                  backgroundColor: '#46a358',
                  fontSize: '24px'
                }}
              >
                {user.prenom.charAt(0)}{user.nom.charAt(0)}
              </div>
              <div className="d-flex flex-column gap-3" style={{ width: '152px' }}>
                <div className="d-flex flex-column justify-content-center gap-1">
                  <span className="fw-bold fs-4 text-black">{user.prenom} {user.nom}</span>
                  <span className="fw-light fs-4 text-black">@{user.prenom.toLowerCase()}{user.nom.toLowerCase().substring(0, 3)}</span>
                </div>
              </div>
            </div>
            
            <div className="d-flex align-items-center justify-content-between w-100">
              <span className="fw-bold fs-5 text-black">Email :</span>
              <span className="fw-bold fs-5 text-black">{user.email}</span>
            </div>
            
            <div className="d-flex align-items-center justify-content-between w-100">
              <span className="fw-bold fs-5 text-black">Téléphone :</span>
              <span className="fw-bold fs-5 text-black">{user.telephone}</span>
            </div>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsUtilisateur;