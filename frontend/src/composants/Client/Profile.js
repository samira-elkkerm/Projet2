import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';

import { modiferProfil } from "../../redux/actions/utilisateursActions";

const Profile = ({ showEditProfile, handleEditProfileClick, utilisateur }) => {

  const dispatch = useDispatch();

  const nomRef = useRef(utilisateur?.nom || "");
  const prenomRef = useRef(utilisateur?.prenom || "");
  const telephoneRef = useRef(utilisateur?.telephone || "");
  const villeRef = useRef(utilisateur?.ville || "");
  const adressRef = useRef(utilisateur?.adress || "");
  const emailRef = useRef(utilisateur?.email || "");

  const validateForm = () => {
    const nom = nomRef.current.value;
    const prenom = prenomRef.current.value;
    const telephone = telephoneRef.current.value;
    const ville = villeRef.current.value;
    const adress = adressRef.current.value;
    const email = emailRef.current.value;

    if (!nom || !prenom || !telephone || !ville || !adress || !email) {
      alert("Veuillez remplir tous les champs");
      return false;
    }

    return true;
  };

  const sauvgarderProfil = () => {
    if (validateForm()) {
      const nom = nomRef.current.value;
      const prenom = prenomRef.current.value;
      const telephone = telephoneRef.current.value;
      const ville = villeRef.current.value;
      const adress = adressRef.current.value;
      const email = emailRef.current.value;
      dispatch(modiferProfil(utilisateur.id, { nom, prenom, telephone, ville, adress, email }));
      alert("Profil mis à jour");
      handleEditProfileClick();
      window.location.reload();
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.reload();
  }

  return (
    <div className="p-4 popup-profile">
      {showEditProfile ? (
        <>
          <div className="profile-icon-wrapper">
            <FontAwesomeIcon icon={faUser} size="2x" className="profile-icon" />
          </div>
          <button className="profile-button-change">
            Changer
          </button>
          <div className="profile-form mt-4">
            <div className="row my-3">
              <div className="col-12 col-lg-6 px-1">
                <input ref={nomRef} type="text" className="form-control" placeholder="Nom" defaultValue={utilisateur?.nom} />
              </div>
              <div className="col-12 col-lg-6 px-1">
                <input ref={prenomRef} type="text" className="form-control" placeholder="Prénom" defaultValue={utilisateur?.prenom} />
              </div>
            </div>
            <div className="row my-3">
              <div className="col-12 col-lg-6 px-1">
                <input type="text" ref={telephoneRef} className="form-control" placeholder="Votre Numéro" defaultValue={utilisateur?.telephone} />
              </div>
              <div className="col-12 col-lg-6 px-1">
                <input type="text" ref={villeRef} className="form-control" placeholder="Ville" defaultValue={utilisateur?.ville} />
              </div>
            </div>
            <div className="row my-2 gap-3">
              <div className="col-12 px-1">
                <input type="text" ref={adressRef} className="form-control" placeholder="Adresse" defaultValue={utilisateur?.adress} />
              </div>
              <div className="col-12 px-1">
                <input type="text" ref={emailRef} className="form-control" placeholder="johndoe@mail.com" defaultValue={utilisateur?.email} />
              </div>
            </div>
            <button onClick={sauvgarderProfil} className="profile-button-submit">
              Enregistrer
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-icon-wrapper">
            <FontAwesomeIcon icon={faUser} size="2x" className="profile-icon" />
          </div>
          <span className="profile-name">{utilisateur?.nom} {utilisateur?.prenom}</span>
          <button className="profile-button" onClick={handleEditProfileClick}>
            Modifier le profil
          </button>
          <button className="profile-button" onClick={logout}>
            Se déconnecter
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;