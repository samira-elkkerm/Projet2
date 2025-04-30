import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AjoutUtilisateur = ({ show, onHide, onUserAdded }) => {
  const villesMaroc = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
    "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan",
    "Salé", "Mohammédia", "El Jadida", "Béni Mellal", "Nador",
    "Taza", "Settat", "Khouribga", "Laâyoune", "Dakhla"
  ];

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    ville: '',
    adress: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    Statut: 'actif',
    role: 'admin'
  });

  const [errors, setErrors] = useState({
    nom: '',
    prenom: '',
    ville: '',
    adress: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: ''
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules = {
    nom: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
      message: "Le nom doit contenir uniquement des lettres (2-50 caractères)"
    },
    prenom: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
      message: "Le prénom doit contenir uniquement des lettres (2-50 caractères)"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Veuillez entrer une adresse email valide"
    },
    telephone: {
      required: true,
      pattern: /^0[5-7][0-9]{8}$/,
      message: "Numéro marocain invalide (ex: 0612345678)"
    },
    ville: {
      required: true,
      message: "Veuillez sélectionner une ville"
    },
    adress: {
      required: true,
      minLength: 5,
      message: "L'adresse doit contenir au moins 5 caractères"
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Le mot de passe doit contenir : 8 caractères Password123 "
      },
    confirmPassword: {
      required: true,
      match: 'password',
      message: "Les mots de passe ne correspondent pas"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;

    let error = "";

    if (rules.required && !value.trim()) {
      error = "Ce champ est obligatoire";
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Doit contenir au moins ${rules.minLength} caractères`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `Doit contenir au maximum ${rules.maxLength} caractères`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = validationRules.confirmPassword.message;
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
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de l\'utilisateur');
      }

      setSuccessMessage("Utilisateur créé avec succès !");
      onUserAdded(data.user);
      
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          ville: '',
          adress: '',
          email: '',
          password: '',
          confirmPassword: '',
          telephone: '',
          Statut: 'actif',
          role: 'admin'
        });
        setErrors({});
        onHide();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un nouvel utilisateur
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formNom">
              <Form.Label className="fw-semibold">
                Nom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={(e) => validateField('nom', e.target.value)}
                isInvalid={!!errors.nom}
                placeholder="Votre Nom"
                className={errors.nom ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formPrenom">
              <Form.Label className="fw-semibold">
                Prénom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={(e) => validateField('prenom', e.target.value)}
                isInvalid={!!errors.prenom}
                placeholder="Votre Prénom"
                className={errors.prenom ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.prenom}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formEmail">
              <Form.Label className="fw-semibold">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => validateField('email', e.target.value)}
                isInvalid={!!errors.email}
                placeholder="exemple@domaine.com"
                className={errors.email ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formTelephone">
              <Form.Label className="fw-semibold">
                Téléphone <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text border-success">+212</span>
                <Form.Control
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  onBlur={(e) => validateField('telephone', e.target.value)}
                  isInvalid={!!errors.telephone}
                  placeholder="0612345678"
                  className={errors.telephone ? "is-invalid" : "border-success"}
                />
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.telephone}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formPassword">
              <Form.Label className="fw-semibold">
                Mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => validateField('password', e.target.value)}
                isInvalid={!!errors.password}
                placeholder="8+ caractères"
                className={errors.password ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>         
            <Form.Group style={{ width: '45%' }} controlId="formConfirmPassword">
              <Form.Label className="fw-semibold">
                Confirmer mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
                isInvalid={!!errors.confirmPassword}
                placeholder="Retapez votre mot de passe"
                className={errors.confirmPassword ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formVille">
              <Form.Label className="fw-semibold">
                Ville <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                onBlur={(e) => validateField('ville', e.target.value)}
                isInvalid={!!errors.ville}
                className={errors.ville ? "is-invalid" : "border-success"}
              >
                <option value="">Sélectionnez une ville</option>
                {villesMaroc.map((ville, index) => (
                  <option key={index} value={ville}>{ville}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ville}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formAdress">
              <Form.Label className="fw-semibold">
                Adresse <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                onBlur={(e) => validateField('adress', e.target.value)}
                isInvalid={!!errors.adress}
                placeholder="123 Rue Principale, Quartier"
                className={errors.adress ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.adress}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-4 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formRole">
              <Form.Label className="fw-semibold">Rôle</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border-success"
              >
                <option value="admin">Administrateur</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formStatut">
              <Form.Label className="fw-semibold">Statut</Form.Label>
              <Form.Select
                name="Statut"
                value={formData.Statut}
                onChange={handleChange}
                className="border-success"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-3 w-100">
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              variant="success" 
              type="submit"
              className="px-4 py-2"
              style={{ backgroundColor: '#46a358', borderColor: '#46a358' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  En cours...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjoutUtilisateur;