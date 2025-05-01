import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Image } from 'react-bootstrap';

const AjouterProduit = ({ show, onHide, onProduitAdded, categories }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    image: null,
    quantité: '',
    id_categorie: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules = {
    nom: {
      required: true,
      minLength: 2,
      maxLength: 255,
      message: "Le nom doit contenir entre 2 et 255 caractères"
    },
    description: {
      required: true,
      minLength: 10,
      message: "La description doit contenir au moins 10 caractères"
    },
    prix: {
      required: true,
      min: 0.01,
      message: "Le prix doit être supérieur à 0"
    },
    quantité: {
      required: true,
      min: 0,
      message: "La quantité ne peut pas être négative"
    },
    id_categorie: {
      required: true,
      message: "Veuillez sélectionner une catégorie"
    },
    image: {
      required: true,
      message: "Veuillez sélectionner une image (JPG, PNG, GIF)"
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      if (file) {
        // Vérification du type de fichier
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, image: "Format d'image non valide" }));
          return;
        }

        // Vérification de la taille (max 2MB comme dans l'API)
        if (file.size > 2048 * 1024) {
          setErrors(prev => ({ ...prev, image: "L'image ne doit pas dépasser 2MB" }));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          setErrors(prev => ({ ...prev, image: '' }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      validateField(name, name === 'image' ? files?.[0] : value);
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;

    let error = "";

    if (rules.required && !value) {
      error = "Ce champ est obligatoire";
    } else if (rules.minLength && value?.length < rules.minLength) {
      error = `Doit contenir au moins ${rules.minLength} caractères`;
    } else if (rules.maxLength && value?.length > rules.maxLength) {
      error = `Doit contenir au maximum ${rules.maxLength} caractères`;
    } else if (rules.min !== undefined && parseFloat(value) < rules.min) {
      error = rules.message;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
        newErrors[field] = errors[field] || validationRules[field].message;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setApiError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Ajoute tous les champs au FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('http://localhost:8000/api/produites', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type' est automatiquement défini pour FormData
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Produit créé avec succès !");
      onProduitAdded(data);
      
      // Réinitialisation après succès
      setTimeout(() => {
        setFormData({
          nom: '',
          description: '',
          prix: '',
          image: null,
          quantité: '',
          id_categorie: ''
        });
        setPreviewImage(null);
        setErrors({});
        onHide();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("Erreur API:", err);
      setApiError(err.message || "Une erreur est survenue lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHide = () => {
    setFormData({
      nom: '',
      description: '',
      prix: '',
      image: null,
      quantité: '',
      id_categorie: ''
    });
    setPreviewImage(null);
    setErrors({});
    setApiError('');
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleHide} 
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un nouveau produit
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && (
          <Alert variant="danger" onClose={() => setApiError('')} dismissible>
            {apiError}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '48%' }} controlId="formNom">
              <Form.Label className="fw-semibold">
                Nom du produit <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={(e) => validateField('nom', e.target.value)}
                isInvalid={!!errors.nom}
                placeholder="Nom du produit"
                className={errors.nom ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '48%' }} controlId="formPrix">
              <Form.Label className="fw-semibold">
                Prix (DH) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                onBlur={(e) => validateField('prix', e.target.value)}
                isInvalid={!!errors.prix}
                placeholder="Prix en dirhams"
                className={errors.prix ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.prix}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '48%' }} controlId="formQuantite">
              <Form.Label className="fw-semibold">
                Quantité <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="quantité"
                value={formData.quantité}
                onChange={handleChange}
                onBlur={(e) => validateField('quantité', e.target.value)}
                isInvalid={!!errors.quantité}
                placeholder="Quantité en stock"
                className={errors.quantité ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantité}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '48%' }} controlId="formCategorie">
              <Form.Label className="fw-semibold">
                Catégorie <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="id_categorie"
                value={formData.id_categorie}
                onChange={handleChange}
                onBlur={(e) => validateField('id_categorie', e.target.value)}
                isInvalid={!!errors.id_categorie}
                className={errors.id_categorie ? "is-invalid" : "border-success"}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.type}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.id_categorie}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label className="fw-semibold">
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={(e) => validateField('description', e.target.value)}
              isInvalid={!!errors.description}
              placeholder="Description détaillée du produit"
              className={errors.description ? "is-invalid" : "border-success"}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formImage">
            <Form.Label className="fw-semibold">
              Image du produit <span className="text-danger">*</span>
            </Form.Label>
            
            {previewImage && (
              <div className="mb-3">
                <Image 
                  src={previewImage} 
                  thumbnail 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                  alt="Prévisualisation de l'image"
                />
                <div className="small text-muted mt-1">
                  {formData.image?.name || "Aucun fichier sélectionné"}
                </div>
              </div>
            )}
            
            <Form.Control
              type="file"
              name="image"
              onChange={handleChange}
              onBlur={(e) => validateField('image', formData.image)}
              isInvalid={!!errors.image}
              className={errors.image ? "is-invalid" : "border-success"}
              accept="image/jpeg, image/png, image/jpg, image/gif"
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
            <Form.Text muted>
              Formats acceptés: JPG, PNG, GIF. Taille maximale: 2MB
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 w-100">
            <Button 
              variant="outline-secondary" 
              onClick={handleHide}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              variant="success" 
              type="submit"
              className="px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  En cours...
                </>
              ) : (
                "Ajouter le produit"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjouterProduit;