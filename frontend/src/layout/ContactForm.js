import React, { useState } from "react";
import "../App.css";
import plant from "../Images/plant.png"; 
import api from "../api"; 

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    let newErrors = {};
    if (!formData.nom) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide.";
    if (!formData.telephone || !/^(\+212|0)[6-7]\d{8}$/.test(formData.telephone))
      newErrors.telephone = "Numéro de téléphone invalide.";
    if (!formData.message) newErrors.message = "Le message ne peut pas être vide.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post("/send-email", formData);

      if (response.status === 200) {
        setSuccessMessage("Le message a été envoyé avec succès !");
        setFormData({ nom: "", prenom: "", email: "", telephone: "", message: "" });
        setErrors({});
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage("Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur :", error.response ? error.response.data : error.message);
      setErrorMessage(error.response?.data?.message || "Une erreur est survenue.");

    }
  };

  return (
    <div className="contact-form-container">
      <div className="image-container">
        <img src={plant} alt="Plante" />
      </div>
      <div className="form-container">
        <h2>Contactez notre équipe</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-container">
              <label>Nom <span className="required-star">*</span></label>
              <input
                type="text"
                name="nom"
                placeholder="Votre Nom"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? "error-input" : ""}
                required
              />
              {errors.nom && <p className="error-message">{errors.nom}</p>}
            </div>

            <div className="input-container">
              <label>Prénom <span className="required-star">*</span></label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre Prénom"
                value={formData.prenom}
                onChange={handleChange}
                className={errors.prenom ? "error-input" : ""}
                required
              />
              {errors.prenom && <p className="error-message">{errors.prenom}</p>}
            </div>
          </div>

          <div className="row">
            <div className="input-container">
              <label>Email <span className="required-star">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Votre Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="input-container">
              <label>Téléphone <span className="required-star">*</span></label>
              <input
                type="tel"
                name="telephone"
                placeholder="+212 Votre Numéro"
                value={formData.telephone}
                onChange={handleChange}
                className={errors.telephone ? "error-input" : ""}
                required
              />
              {errors.telephone && <p className="error-message">{errors.telephone}</p>}
            </div>
          </div>

          <div className="input-container">
            <label>Message <span className="required-star">*</span></label>
            <textarea
              name="message"
              placeholder="Votre message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "error-input" : ""}
              required
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>

          <button type="submit">Envoyer</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ContactForm;
