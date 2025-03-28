import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import icone from "../Images/icone.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Connecter = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La réponse du serveur n'est pas au format JSON.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Erreur de connexion"
        );
      }

      const data = await response.json();
      console.log(data);

      if (data.token && data.user) {
        console.log("Token reçu:", data.token);
        console.log("Utilisateur reçu:", data.user);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user.id);
        console.log("Token stocké dans localStorage:", data.token);
        console.log("ID utilisateur stocké dans localStorage:", data.user.id);
        if (data.user.role === "admin") {
          navigate("/Admin/TableauBord");
        } else if (data.user.role === "client") {
          navigate("/");
        }
      } else {
        setErrors({ message: "unauthorized" });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error.message);
      setErrors({ message: error.message || "Une erreur de connexion." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (!storedToken) {
      navigate("/Connecter");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <img src={icone} alt="icone" className="signup-logo" />
          <div className="signup-options">
            <Link to="/Connecter" className="signup-option active">
              Se connecter
            </Link>
            <span className="signup-separator">|</span>
            <Link to="/Inscrire" className="signup-option">
              S'inscrire
            </Link>
          </div>
        </div>

        <p className="signup-instructions text-center">
          Entrez vos informations pour vous connecter.
        </p>

        {errors.message && (
          <div className="alert alert-danger" role="alert">
            {errors.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group col-md-12">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <div className="password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
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
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connecter;
