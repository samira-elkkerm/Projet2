import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import PHFOOTER3 from '../Images/PHFOOTER3.png';
import PHFOOTER2 from '../Images/PHFOOTER2.png';
import PHFOOTER1 from '../Images/PHFOOTER1.png';
import Calling from '../Images/Calling.png';
import Location from '../Images/Location.png';
import Message from '../Images/Message.png';
import Facebook from '../Images/Facebook.png';
import Instagram from '../Images/Instagram.png';
import Linkedin from '../Images/Linkedin.png';

const Footer = () => {
  return (
    <div className="footer">
     
      <div className="component-wrapper">
        <div className="component">
          <div className="aroosage">
            <img className="img" src={PHFOOTER3} alt="Arrosage des plantes" />
            <div className="text-wrapper">Arrosage des plantes</div>
            <p className="une-plateforme-en">
              Une plateforme en ligne spécialisée dans la vente de plantes, accessoires de jardinage et produits connexes.
            </p>
          </div>
          <div className="entretien-du-jardin">
            <img className="img" src={PHFOOTER2} alt="Entretien du Jardin" />
            <div className="text-wrapper">Entretien du Jardin</div>
            <p className="une-plateforme-en">
              Une plateforme en ligne spécialisée dans la vente de plantes, accessoires de jardinage et produits connexes.
            </p>
          </div>
          <div className="rnovation-d-usine">
            <img className="img" src={PHFOOTER1} alt="Rénovation d'Usine" />
            <div className="text-wrapper">Rénovation d'Usine</div>
            <p className="une-plateforme-en">
              Une plateforme en ligne spécialisée dans la vente de plantes, accessoires de jardinage et produits connexes.
            </p>
          </div>
        </div>
      </div>

      
      <div className="coordonnes-wrapper">
        <div className="coordonnes">
          <div className="phone">
            <img className="iconly-curved" src={Calling} alt="Phone" />
            <div className="div">+212 0512363381</div>
          </div>
          <div className="adresse">
            <img className="location" src={Location} alt="Adresse" />
            <a href="https://www.google.com/maps/place/Aghmat/" target="_blank" rel="noopener noreferrer">
              <p className="p">Aghmat Centre, Al Haouz - Marrakech</p>
            </a>
          </div>
          <div className="email">
            <img className="iconly-curved-2" src={Message} alt="Email" />
            <input className="contact-toudert-com" placeholder="contact@toudert.com" type="email" />
          </div>
        </div>
      </div>

      
      <div className="footer-wrapper">
        <div className="div-2">
          <div className="mon-compte">
            <div className="text-wrapper-2">Mon Compte</div>
            <Link to="/" className="text-wrapper-3 hover-effect">Accueil</Link>
            <Link to="/boutique" className="text-wrapper-3 hover-effect">Boutique</Link>
            <Link to="/plantes" className="text-wrapper-3 hover-effect">Plantes</Link>
            <Link to="/contact" className="text-wrapper-3 hover-effect">Contact</Link>
          </div>
          <div className="catgories">
            <div className="text-wrapper-2">Catégories</div>
            <Link to="/plantes" className="text-wrapper-4 hover-effect">Plantes</Link>
            <Link to="/accessoires" className="text-wrapper-4 hover-effect">Accessoires de jardinage</Link>
            <Link to="/produits" className="text-wrapper-4 hover-effect">Produits connexes</Link>
          </div>
          <div className="reseaux-sociaux">
            <div className="text-wrapper-5">Réseaux sociaux</div>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover-effect">
                <img className="facebook" src={Facebook} alt="Facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover-effect">
                <img className="instagram" src={Instagram} alt="Instagram" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover-effect">
                <img className="linkedin" src={Linkedin} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;