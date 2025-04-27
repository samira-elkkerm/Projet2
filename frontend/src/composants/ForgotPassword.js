import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import icone from "../Images/icone.PNG";
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
          const response = await fetch('http://localhost:8000/api/forgot-password', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.message || 'Erreur lors de la requête');
          }
          alert(data.message);
          if (data.redirect) {
              window.location.href = data.redirect;
          } else {
              window.location.href = '/Connecter';
          }
  
      } catch (err) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };

    return (
            <div className="signup-container">
              <div className="signup-content">
                <div className="signup-header">
                  <img src={icone} alt="icone" className="signup-logo" />
                  <div className="signup-options">
                    
                    <span className="signup-separator">Mot de passe oublié </span>
                    
                  </div>
                </div>
          
                <p className="signup-instructions text-center">
                  Entrez votre email pour réinitialiser votre mot de passe.
                </p>
          
                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
          
                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        required
                      />
                      {error && (
                        <div className="invalid-feedback">{error}</div>
                      )}
                    </div>
                  </div>
          
                  <button
                    type="submit"
                    className="btn-primary btn-block"
                    disabled={isLoading}
                  >
                    {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                  </button>
          
                  <div className="text-center mt-3">
                    <Link to="/Connecter">Retour à la connexion</Link>
                  </div>
                </form>
              </div>
            </div>
          );
};

export default ForgotPassword;