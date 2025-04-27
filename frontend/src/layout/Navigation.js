import { Link, useLocation, useNavigate } from "react-router-dom";
import tudert from "../Images/tudert.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faXmark,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { fetchUtilisateur } from "../redux/actions/utilisateursActions";

import Profile from "../composants/Client/Profile"

const Navigation = () => {
  const dispatch = useDispatch();
  const { panier } = useSelector((state) => state.panier);
  const { utilisateurActuel } = useSelector((state) => state.utilisateurs);

  console.log('User: ', utilisateurActuel);

  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const id = localStorage.getItem("userId");
      dispatch(fetchUtilisateur(id));
    }
  }, [isAuthenticated, dispatch]);

  const handleLoginClick = () => {
    navigate("/Connecter");
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowEditProfile(false);
  };

  const handleEditProfileClick = () => {
    setShowEditProfile(!showEditProfile);
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <img
            src={tudert}
            alt="Tudert logo"
            className="logo"
            style={{ width: "100px", height: "100px" }}
          />
        </div>

        <div className="d-flex justify-content-center flex-grow-1">
          <ul className="navbar-nav d-flex justify-content-center w-100">
            <li className={`nav-item ms-5 ${isActive("/")}`}>
              <Link to="/">Accueil</Link>
            </li>
            <li className={`nav-item ms-5 ${isActive("/Boutique")}`}>
              <Link to="/Boutique">Boutique</Link>
            </li>
            <li className={`nav-item ms-5 ${isActive("/Contact")}`}>
              <Link to="/Contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="d-flex justify-content-end">
          <ul className="navbar-nav d-flex justify-content-end">
            <li className="nav-item ms-3">
              <Link to="/search" aria-label="Search">
                <FontAwesomeIcon icon={faSearch} className="nav-icon" />
              </Link>
            </li>
            <li className="nav-item ms-3">
              <Link to="/Panier" aria-label="Cart" className="position-relative">
                <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
                <span className="cart-count">{panier ? panier.length : 0}</span>
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="position-relative nav-item ms-3">
                <button
                  className="nav-btn btn btn-success"
                  onClick={handleProfileClick}
                >
                  <FontAwesomeIcon icon={faUser} className="nav-icon user-icon" />
                </button>
                <div className={`popup-cart ${showProfile ? "visible" : "invisible"} ${showEditProfile ? "more-w" : "normal-w"}`}>
                  <button
                    className="popup-close"
                    onClick={handleProfileClick}
                  >
                    <FontAwesomeIcon icon={faXmark} className="popup-close-icon" />
                  </button>
                  {showEditProfile && (
                    <button
                      className="profile-back"
                      onClick={handleEditProfileClick}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="popup-close-icon" />
                    </button>
                  )}
                  <Profile showEditProfile={showEditProfile} handleEditProfileClick={handleEditProfileClick} utilisateur={utilisateurActuel} />
                </div>
              </li>
            ) : (
              <li className="nav-item ms-3">
                <button
                  className="nav-btn btn btn-success"
                  onClick={handleLoginClick}
                >
                  Se Connecter
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
