import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import icone from "../Images/icone.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        
        // Validation côté client
        const newErrors = {};
        if (!token) newErrors.token = ["Le token est requis"];
        if (password.length < 6) newErrors.password = ["Le mot de passe doit contenir au moins 6 caractères"];
        if (password !== passwordConfirmation) newErrors.password_confirmation = ["Les mots de passe ne correspondent pas"];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    token: token,
                    password: password,
                    password_confirmation: passwordConfirmation 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la réinitialisation');
            }

            setMessage(data.message || 'Votre mot de passe a été réinitialisé avec succès');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setErrors({ 
                general: [err.message || "Une erreur est survenue lors de la réinitialisation"] 
            });
        } finally {
            setIsLoading(false);
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
                <span className="signup-separator">Réinitialisation du mot de passe</span>
              </div>
            </div>
      
            <p className="signup-instructions text-center">
              Entrez votre nouveau mot de passe.
            </p>
      
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
            
            {errors.general && (
              <div className="alert alert-danger" role="alert">
                {errors.general[0]}
              </div>
            )}
      
            <form onSubmit={handleSubmit} className="signup-form">
              <input type="hidden" name="token" value={token} />
              
              <div className="form-row">
                <div className="form-group col-md-12">
                  <div className="password-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password[0]}</div>
                    )}
                  </div>
                </div>
              </div>
      
              <div className="form-row">
                <div className="form-group col-md-12">
                  <div className="password-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Confirmez le mot de passe"
                      className={`form-control ${errors.password_confirmation ? "is-invalid" : ""}`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                    {errors.password_confirmation && (
                      <div className="invalid-feedback">{errors.password_confirmation[0]}</div>
                    )}
                  </div>
                </div>
              </div>
      
              <button
                type="submit"
                className="btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
              </button>
      
              <div className="text-center mt-3">
                <Link to="/login">Retour à la connexion</Link>
              </div>
            </form>
          </div>
        </div>
    );
};

export default ResetPassword;