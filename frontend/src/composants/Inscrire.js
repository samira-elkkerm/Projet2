import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import icone from "../Images/icone.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Inscrire = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    ville: "",
    adress: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const staticCities = [
      "Casablanca",
      "Rabat",
      "Marrakech",
      "Fès",
      "Tanger",
      "Agadir",
      "Meknès",
      "Oujda",
      "Kenitra",
      "Tétouan",
      "Safi",
      "Mohammedia",
      "Khouribga",
      "El Jadida",
      "Béni Mellal",
      "Nador",
      "Taza",
      "Settat",
      "Larache",
      "Khemisset",
    ];
    setCities(staticCities);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) {
          error = "L'email est requis.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "L'email n'est pas valide.";
        }
        break;

      case "password":
        if (!value) {
          error = "Le mot de passe est requis.";
        } else if (value.length < 6) {
          error = "Le mot de passe doit contenir au moins 6 caractères.";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "La confirmation du mot de passe est requise.";
        } else if (value !== formData.password) {
          error = "Les mots de passe ne correspondent pas.";
        }
        break;

      case "nom":
        if (!value) {
          error = "Le nom est requis.";
        }
        break;

      case "prenom":
        if (!value) {
          error = "Le prénom est requis.";
        }
        break;

      case "telephone":
        if (!value) {
          error = "Le téléphone est requis.";
        } else if (!/^\d+$/.test(value)) {
          error = "Le téléphone doit contenir uniquement des chiffres.";
        }
        break;

      case "ville":
        if (!value) {
          error = "La ville est requise.";
        }
        break;

      case "adress":
        if (!value) {
          error = "L'adresse est requise.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = [error];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        ville: formData.ville,
        adress: formData.adress,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };

      const response = await api.post("/register", dataToSend);
      console.log("Success:", response.data);
      navigate("/Connecter");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          message: ["Une erreur de l'inscription."],
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <img src={icone} alt="icone" className="signup-logo" />
          <div className="signup-options">
            <Link to="/Connecter" className="signup-option">
              Se connecter
            </Link>
            <span className="signup-separator">|</span>
            <span className="signup-option active">S'inscrire</span>
          </div>
        </div>

        <p className="signup-instructions text-center">
          Entrez votre formation pour vous inscrire.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nom"
                className={`form-control ${errors.nom ? "is-invalid" : ""}`}
              />
              {errors.nom && (
                <div className="invalid-feedback">{errors.nom[0]}</div>
              )}
            </div>
            <div className="form-group col-md-6">
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Prenom"
                className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
              />
              {errors.prenom && (
                <div className="invalid-feedback">{errors.prenom[0]}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Votre Numéro"
                className={`form-control ${
                  errors.telephone ? "is-invalid" : ""
                }`}
              />
              {errors.telephone && (
                <div className="invalid-feedback">{errors.telephone[0]}</div>
              )}
            </div>
            <div className="form-group col-md-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email[0]}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control custom-select ${
                  errors.ville ? "is-invalid" : ""
                }`}
              >
                <option value="">Sélectionnez une ville</option>
                {cities.map((city, index) => (
                  <option key={index} value={city} className="green-option">
                    {city}
                  </option>
                ))}
              </select>
              {errors.ville && (
                <div className="invalid-feedback">{errors.ville[0]}</div>
              )}
            </div>
            <div className="form-group col-md-6">
              <input
                type="text"
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="adresse"
                className={`form-control ${errors.adress ? "is-invalid" : ""}`}
              />
              {errors.adress && (
                <div className="invalid-feedback">{errors.adress[0]}</div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Mode de passe"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password[0]}</div>
              )}
            </div>
            <div className="form-group col-md-6">
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirmer"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword[0]}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-block">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscrire;
