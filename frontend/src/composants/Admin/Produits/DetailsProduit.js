import React from 'react';
import { Modal, Button, Image, Badge } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsProduit = ({ produit, show, onHide, getCategoryName }) => {
  if (!produit) return null;

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
          <span className="fs-3 fw-bold">Détails du produit</span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="d-flex gap-4">
          {/* Image Section */}
          <div className="d-flex flex-column align-items-center bg-white p-4 rounded-3" 
               style={{ width: '400px' }}>
            <Image 
              src={`http://localhost:8000/images/${produit.image}`} 
              style={{ 
                width: '300px',
                height: '300px',
                objectFit: 'cover'
              }}
              rounded
            />
          </div>

          {/* Details Section */}
          <div className="flex-grow-1 bg-white p-4 rounded-3">
            <div className="d-flex flex-column gap-4">
              <div>
                <h2 className="fw-bold mb-3">{produit.nom}</h2>
                <Badge 
                  bg={produit.quantité > 0 ? "success" : "danger"} 
                  className="fs-6 mb-3"
                >
                  {produit.quantité > 0 ? 'En Stock' : 'Rupture'}
                </Badge>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Catégorie :</span>
                  <span>{getCategoryName(produit.id_categorie)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Prix :</span>
                  <span className="text-success fw-bold">
                    {parseFloat(produit.prix).toFixed(2)} DH
                  </span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Quantité disponible :</span>
                  <span>{produit.quantité}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Date d'ajout :</span>
                  <span>{new Date(produit.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="fw-bold mb-3">Description</h5>
                <p className="text-muted" style={{ textAlign: 'justify' }}>
                  {produit.description || "Aucune description disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsProduit;