import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../layout/MenuAdmin';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { BiTrash, BiShow, BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const GestionCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [groupedCommandes, setGroupedCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfProducts, setNumberOfProducts] = useState(1);
  const [products, setProducts] = useState([]);
  const [ligneCommandes, setLigneCommandes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState([{ id_produite: '', quantité: 1 }]);
  const [userId, setUserId] = useState(4);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [step, setStep] = useState("produits");
  const [panierItems, setPanierItems] = useState([]);
  console.log(panierItems);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    pays: "Maroc",
    ville: "",
    adress: "",
    email: "",
    telephone: "",
    notes: "",
  });

  const villes = [
    { nom: "Casablanca", frais: 30 },
    { nom: "Rabat", frais: 25 },
    { nom: "Marrakech", frais: 35 },
    { nom: "Fès", frais: 40 },
    { nom: "Tanger", frais: 45 },
    { nom: "Agadir", frais: 50 },
    { nom: "Meknès", frais: 35 },
    { nom: "Oujda", frais: 55 },
    { nom: "Kénitra", frais: 30 },
    { nom: "Tétouan", frais: 45 },
  ];

  const [fraisLivraison, setFraisLivraison] = useState(30);
  const totalproduites = panierItems.reduce(
    (total, item) => total + item.produit.prix * item.quantité,
    0
  );
  const totalGeneral = totalproduites + fraisLivraison;

  useEffect(() => {
    if (userData.ville) {
      const villeUtilisateur = villes.find((v) => v.nom === userData.ville);
      if (villeUtilisateur) {
        setFraisLivraison(villeUtilisateur.frais);
      }
    }
  }, [userData.ville]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nom":
      case "prenom":
        if (!value.trim()) error = "Ce champ est obligatoire";
        else if (value.length < 2)
          error = "Doit contenir au moins 2 caractères";
        else if (!/^[a-zA-ZÀ-ÿ -]+$/.test(value))
          error = "Caractères invalides";
        break;
      case "email":
        if (!value.trim()) error = "Ce champ est obligatoire";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email invalide";
        break;
      case "telephone":
        if (!value.trim()) error = "Ce champ est obligatoire";
        else if (!/^0[5-7][0-9]{8}$/.test(value))
          error = "Numéro invalide (ex: 0612345678)";
        break;
      case "ville":
      case "adress":
        if (!value.trim()) error = "Ce champ est obligatoire";
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (name === "ville") {
      const villeSelectionnee = villes.find((v) => v.nom === value);
      if (villeSelectionnee) {
        setFraisLivraison(villeSelectionnee.frais);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const requiredFields = [
      "nom",
      "prenom",
      "ville",
      "adress",
      "email",
      "telephone",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, userData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const generateOrderNumber = () => {
    let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber')) || 0;
    lastOrderNumber++;
    localStorage.setItem('lastOrderNumber', lastOrderNumber);
    return `CMD-${lastOrderNumber}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const numeroCommande = generateOrderNumber(userId);

      for (const item of panierItems) {
        const commandeData = {
          numero_commande: numeroCommande,
          user_id: JSON.parse(localStorage.getItem("userId")),
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          telephone: userData.telephone,
          adress: userData.adress,
          ville: userData.ville,
          notes: userData.notes || "",
          ligne_commande_id: item.id,
          total_produits: item.produit.prix * item.quantité,
          frais_livraison: fraisLivraison,
          total: item.produit.prix * item.quantité + fraisLivraison,
          methode_paiement: "à la livraison",
        };

        const response = await fetch("http://localhost:8000/api/commandes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(commandeData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (data.errors
                ? Object.values(data.errors).flat().join(", ")
                : "Erreur lors de la commande")
          );
        }
      }

      setShowAddModal(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowDetails = (commande) => {
    setSelectedCommande(commande);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    const storedId = localStorage.getItem('userId');

    if (storedId !== null) {
      setUserId(Number(storedId));
    }
  }, []);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/produites");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching panier data:", error);
      }
    };

    fetchPanier();
  }, []);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching panier data:", error);
      }
    };

    fetchPanier();
  }, []);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ligne-commandes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLigneCommandes(data.ligneCommandes);
      } catch (error) {
        console.error("Error fetching panier data:", error);
      }
    };

    fetchPanier();
  }, []);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/commandes');

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.commandes) {
          throw new Error('Réponse API invalide');
        }

        setCommandes(data.commandes);
        const grouped = groupByNumeroCommande(data.commandes);
        setGroupedCommandes(grouped);

      } catch (err) {
        console.error("Erreur API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const groupByNumeroCommande = (commandes) => {
    const grouped = {};

    commandes.forEach(commande => {
      if (!grouped[commande.numero_commande]) {
        grouped[commande.numero_commande] = {
          id: commande.numero_commande,
          nom: `${commande.prenom} ${commande.nom}`,
          date: new Date(commande.created_at).toLocaleDateString('fr-FR'),
          qte: commande.total_produits,
          montant: commande.total,
          status: commande.statut,
          commandesDetails: [commande]
        };
      } else {
        grouped[commande.numero_commande].qte += commande.total_produits;
        grouped[commande.numero_commande].montant += commande.total;
        grouped[commande.numero_commande].commandesDetails.push(commande);
      }
    });

    return Object.values(grouped);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      const grouped = groupByNumeroCommande(commandes);
      setGroupedCommandes(grouped);
      return;
    }

    const filtered = commandes.filter(commande => {
      return (
        commande.nom.toLowerCase().includes(term) ||
        commande.prenom.toLowerCase().includes(term) ||
        commande.numero_commande.toLowerCase().includes(term) ||
        new Date(commande.created_at).toLocaleDateString('fr-FR').includes(term) ||
        commande.statut.toLowerCase().includes(term)
      );
    });

    const groupedFiltered = groupByNumeroCommande(filtered);
    setGroupedCommandes(groupedFiltered);
  };

  const handleProductChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index] = {
      ...newFormData[index],
      [field]: field === 'quantité' ? parseInt(value) || 1 : value
    };
    setFormData(newFormData);
  };

  const handleAddProduct = () => {
    setFormData([...formData, { id_produite: '', quantité: 1 }]);
    setNumberOfProducts(numberOfProducts + 1);
  };

  const handleRemoveProduct = (index) => {
    if (formData.length <= 1) return;
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
    setNumberOfProducts(numberOfProducts - 1);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      alert("Erreur : utilisateur non identifié");
      return;
    }
  
    // Vérification des champs vides
    const hasEmptyFields = formData.some(
      (item) => !item.id_produite || !item.quantité
    );
  
    if (hasEmptyFields) {
      alert("Veuillez remplir tous les champs pour chaque produit.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/ligne-commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id_utilisateur: userId,
          produits: formData,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        const newPanierItems = result.data.map((commande, index) => {
            const product = products.find(p => p.id === parseInt(commande.id_produite));
            return {
                id: commande.id, // Utilisation de l'ID réel
                id_ligne_commande: commande.id, // Même ID pour compatibilité
                produit: product,
                quantité: commande.quantité
            };
        });
        
        setPanierItems(newPanierItems);
        setStep("utilisateur");
    } else {
        if (result.errors) {
          const messages = Object.values(result.errors)
            .flat()
            .join("\n");
          alert("Erreur de validation:\n" + messages);
        } else if (result.message) {
          alert(result.message);
        } else {
          alert("Une erreur est survenue.");
        }
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur réseau ou serveur : " + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarMenu />
        <div style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>Commandes</h2>
            <p>Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }
  const handleDeleteCommande = async (numeroCommande) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer toutes les commandes avec le numéro ${numeroCommande}?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/commandes/${numeroCommande}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la suppression');
        }
  
        // Mettre à jour l'état local après suppression
        setGroupedCommandes(prev => prev.filter(cmd => cmd.id !== numeroCommande));
        
        alert(data.message);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarMenu />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <h2 style={styles.title}>Commandes</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={styles.searchContainer}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, numéro de commande, date ou statut..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
              />
            </div>
            <Button variant="success" onClick={() => setShowAddModal(true)}>+ Ajouter commande</Button>
          </div>

          <div style={styles.tableContainer}>
            <Table borderless responsive style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.thCell}>N° Commande</th>
                  <th style={styles.thCell}>Client</th>
                  <th style={styles.thCell}>Date</th>
                  <th style={styles.thCell}>Quantité</th>
                  <th style={styles.thCell}>Montant Total</th>
                  <th style={styles.thCell}>Statut</th>
                  <th style={styles.thCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedCommandes.length > 0 ? (
                  groupedCommandes.map((commande, index) => (
                    <tr key={index} style={styles.tableRow}>
                      <td style={styles.tdCell}>{commande.id}</td>
                      <td style={styles.tdCell}>{commande.nom}</td>
                      <td style={styles.tdCell}>{commande.date}</td>
                      <td style={styles.tdCell}>{commande.qte}</td>
                      <td style={styles.tdCell}>{commande.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</td>
                      <td style={styles.tdCell}>
                        <span style={getStatusStyle(commande.status)}>
                          {commande.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ ...styles.tdCell, ...styles.actionsCell }}>
                        <Button variant="outline-success" size="sm" style={styles.iconButton} onClick={() => handleShowDetails(commande)}>
                          <BiShow />
                        </Button>
                        <Button variant="outline-danger" size="sm" style={styles.iconButton} onClick={() => handleDeleteCommande(commande.id)}>
                          <BiTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>







      {/* Modal pour ajouter une commande */}
     {/* Modal pour ajouter une commande */}
     <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        setFormData([{ id_produite: '', quantité: 1 }]);
        setNumberOfProducts(1);
        setStep("produits");
      }} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === "produits" && (
            <Form onSubmit={HandleSubmit}>
              {formData.map((item, index) => (
                <div key={index} className="mb-3 p-3 border rounded position-relative">
                  {index > 0 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => handleRemoveProduct(index)}
                      style={{ borderRadius: '50%', width: '30px', height: '30px' }}
                    >
                      ×
                    </Button>
                  )}
                  <div className="row align-items-center">
                    <Form.Group className="col-md-6">
                      <Form.Label>Produit {index + 1}:</Form.Label>
                      <Form.Select
                        required
                        value={item.id_produite}
                        onChange={(e) => handleProductChange(index, 'id_produite', e.target.value)}
                      >
                        <option value="">Sélectionnez un produit</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.nom} - {product.prix} DH
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="col-md-4">
                      <Form.Label>Quantité:</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        required
                        value={item.quantité}
                        onChange={(e) => handleProductChange(index, 'quantité', e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3">
                <Button variant="outline-primary" onClick={handleAddProduct}>
                  + Ajouter un produit
                </Button>
                <div>
                  <Button variant="secondary" onClick={() => {
                    setShowAddModal(false);
                    setFormData([{ id_produite: '', quantité: 1 }]);
                    setNumberOfProducts(1);
                  }} className="me-2">
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Suivant
                  </Button>
                </div>
              </div>
            </Form>
          )}
          {step === "utilisateur" && (
            <div className="container-fluid p-5">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="fw-medium">Adresse de facturation</h5>
                  <hr className="border-success" />
                  {errors.form && (
                    <div className="alert alert-danger">{errors.form}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">
                          Nom <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="nom"
                          className={`form-control ${
                            errors.nom ? "is-invalid" : "border-success"
                          }`}
                          value={userData.nom}
                          onChange={handleInputChange}
                        />
                        {errors.nom && (
                          <div className="invalid-feedback">{errors.nom}</div>
                        )}
                      </div>
                      <div className="col">
                        <label className="form-label">
                          Prénom <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          className={`form-control ${
                            errors.prenom ? "is-invalid" : "border-success"
                          }`}
                          value={userData.prenom}
                          onChange={handleInputChange}
                        />
                        {errors.prenom && (
                          <div className="invalid-feedback">{errors.prenom}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-6">
                      <div className="col">
                        <label className="form-label">
                          Pays <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="pays"
                          className="form-control border-success"
                          value={userData.pays}
                          readOnly
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">
                          Ville <span className="text-danger">*</span>
                        </label>
                        <select
                          name="ville"
                          className={`form-select ${
                            errors.ville ? "is-invalid" : "border-success"
                          }`}
                          value={userData.ville}
                          onChange={handleInputChange}
                        >
                          <option value="">Sélectionnez une ville</option>
                          {villes.map((ville, index) => (
                            <option key={index} value={ville.nom}>
                              {ville.nom} (+{ville.frais} DH)
                            </option>
                          ))}
                        </select>
                        {errors.ville && (
                          <div className="invalid-feedback">{errors.ville}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">
                          Adresse <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="adress"
                          className={`form-control ${
                            errors.adress ? "is-invalid" : "border-success"
                          }`}
                          value={userData.adress}
                          onChange={handleInputChange}
                        />
                        {errors.adress && (
                          <div className="invalid-feedback">{errors.adress}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : "border-success"
                          }`}
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                      <div className="col">
                        <label className="form-label">
                          Téléphone <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          
                          <input
                            type="tel"
                            name="telephone"
                            className={`form-control ${
                              errors.telephone ? "is-invalid" : "border-success"
                            }`}
                            value={userData.telephone}
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.telephone && (
                          <div className="invalid-feedback">{errors.telephone}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">Notes de commande</label>
                        <textarea
                          name="notes"
                          className="form-control border-success"
                          rows="3"
                          value={userData.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="col-md-5">
                  <div className="mb-4">
                    <h5 className="fw-medium">Produits</h5>
                    <hr className="border-success" />
                    {panierItems.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3 bg-light p-3 rounded"
                      >
                        <img
                          src={`http://127.0.0.1:8000/images/${item.produit.image}`}
                          alt={item.produit.nom}
                          className="img-thumbnail me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0">{item.produit.nom}</h6>
                          <small className="text-muted">Réf: {item.produit.id}</small>
                        </div>
                        <span className="fw-bold me-3">(x {item.quantité})</span>
                        <span className="fw-bold text-success">
                          {item.produit.prix * item.quantité} DH
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Total produits</span>
                      <span className="fw-bold">{totalproduites} DH</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Livraison ({userData.ville})</span>
                      <span className="fw-bold">{fraisLivraison} DH</span>
                    </div>
                    <hr className="border-success" />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold">{totalGeneral} DH</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="fw-medium">Paiement</h5>
                    <div className="mb-3">
                      <select
                        className="form-select border-success"
                        value="Paiement à la livraison"
                        disabled
                      >
                        <option>Paiement à la livraison</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-success btn-lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting || panierItems.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          En cours...
                        </>
                      ) : (
                        "Valider la commande"
                      )}
                    </button>
                    {panierItems.length === 0 && (
                      <div className="alert alert-warning mt-3">
                        Votre panier est vide
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>







      {/* Modal pour afficher les détails de la commande */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <div className="d-flex gap-3 mb-4">
    {/* Section gauche - Détails produits et statut */}
    <div className="flex-grow-1 border p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Tableau des articles */}
      <div style={{ marginBottom: '30px' }}>
        <h6 style={{ 
          color: '#46A358', 
          marginBottom: '20px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          <i className="fas fa-list-alt me-2"></i>
          Détails Commande : {selectedCommande?.id}
        </h6>

        <Table hover borderless responsive className="align-middle">
          <thead>
            <tr style={{ 
              backgroundColor: '#46A35820',
              color: '#2d3748',
              fontWeight: '500'
            }}>
              <th style={{ padding: '12px', width: '40%' }}>Article</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Prix</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Quantité</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedCommande?.commandesDetails.map((detail, index) => {
              const ligne = ligneCommandes.find(l => l.id === detail.ligne_commande_id);
              const produit = products.find(p => p.id === ligne?.id_produite);

              if (!ligne || !produit) return null;

              return (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://127.0.0.1:8000/images/${produit.image || 'default.jpg'}`}
                        alt={produit.nom}
                        className="img-thumbnail me-3 rounded-2"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderColor: '#e0e0e0'
                        }}
                        onError={(e) => e.target.src = 'http://127.0.0.1:8000/images/default.jpg'}
                      />
                      <div>
                        <div className="fw-bold" style={{ color: '#2d3748' }}>{produit.nom}</div>
                        <div className="text-muted small" style={{ fontSize: '0.85rem' }}>
                          {categories.find(c => c.id === produit.id_categorie)?.type || 'Non catégorisé'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#4a5568' }}>{produit.prix.toFixed(2)} Dh</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#4a5568' }}>{ligne.quantité}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#46A358' }}>
                    {(produit.prix * ligne.quantité).toFixed(2)} Dh
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Barre de statut */}
      <div style={{ marginTop: '30px' }}>
        <h6 style={{ 
          color: '#46A358', 
          marginBottom: '20px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          <i className="fas fa-truck me-2"></i>
          Statut de la commande
        </h6>
        
        <div className='d-flex justify-content-between align-items-center'>
            <div style={{
              padding: '10px 0',
              color: selectedCommande?.status === 'en_attente' || 
                    selectedCommande?.status === 'en_cours' || 
                    selectedCommande?.status === 'livree' ? '#46A358' : '#ccc'
            }}>
              <div>Commande créée</div>
              {selectedCommande?.status === 'en_attente' && <div className="small">(actuel)</div>}
            </div>
            
            <div style={{ flex: 1, borderTop: '1px solid #e0e0e0', margin: '0 10px' }}></div>
            
            <div style={{
              padding: '10px 0',
              color: selectedCommande?.status === 'en_cours' || 
                    selectedCommande?.status === 'livree' ? '#46A358' : '#ccc'
            }}>
              <div>En cours</div>
              {selectedCommande?.status === 'en_cours' && <div className="small">(actuel)</div>}
            </div>
            
            <div style={{ flex: 1, borderTop: '1px solid #e0e0e0', margin: '0 10px' }}></div>
            
            <div style={{
              padding: '10px 0',
              color: selectedCommande?.status === 'livree' ? '#46A358' : '#ccc'
            }}>
              <div>Livrée</div>
              {selectedCommande?.status === 'livree' && <div className="small">(actuel)</div>}
            </div>
          </div>
      </div>
    </div>

    {/* Section droite - Résumé et informations */}
    <div className="flex-grow-1 border p-3 rounded-3" style={{ maxWidth: '350px', backgroundColor: '#f8f9fa' }}>
      {/* Résumé de commande */}
      <div style={{ marginBottom: '30px' }}>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h6 style={{ 
            color: '#46A358', 
            marginBottom: '0',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            <i className="fas fa-receipt me-2"></i>
            Récapitulatif
          </h6>
          <span style={getStatusStyle(selectedCommande?.status)} className="badge">
            {selectedCommande?.status.replace('_', ' ')}
          </span>
        </div>
        
        {selectedCommande && (
          <div className="summary-card p-3 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
            <div className="d-flex justify-content-between mb-2">
              <span>Articles:</span>
              <span>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.total_produits || 0}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Livraison:</span>
              <span>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.frais_livraison || 0} Dh</span>
            </div>
            <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: '1px dashed #e0e0e0', fontWeight: '600' }}>
              <span>Total:</span>
              <span style={{ color: '#46A358' }}>
                {commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.total || 0} Dh
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Informations client */}
      <div>
        <h6 style={{ 
          color: '#46A358', 
          marginBottom: '20px',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          <i className="fas fa-user-circle me-2"></i>
          Informations client
        </h6>

        {selectedCommande && (
          <div className="info-card p-3 rounded-2" style={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
            <div className="mb-3">
              <div className="text-muted small mb-1">Nom</div>
              <div>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.nom || '-'}</div>
            </div>
            <div className="mb-3">
              <div className="text-muted small mb-1">Email</div>
              <div>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.email || '-'}</div>
            </div>
            <div className="mb-3">
              <div className="text-muted small mb-1">Téléphone</div>
              <div>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.telephone || '-'}</div>
            </div>
            <div>
              <div className="text-muted small mb-1">Adresse</div>
              <div>{commandes.find(cmd => cmd.numero_commande === selectedCommande?.id)?.adress || '-'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  mainContent: {
    width: '80%',
    marginLeft: '25%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  contentWrapper: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa'
  },
  searchContainer: {
    position: 'relative',
    width: '60%',
    marginRight: '15px'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    color: '#6c757d'
  },
  searchInput: {
    paddingLeft: '35px',
    borderRadius: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  title: {
    color: '#0B1E0F',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600'
  },
  table: {
    margin: '0 auto',
    width: '100%'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
    borderBottom: '1px solid #dee2e6'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  thCell: {
    padding: '16px 12px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#495057',
    border: 'none'
  },
  tdCell: {
    padding: '14px 12px',
    textAlign: 'center',
    verticalAlign: 'middle',
    border: 'none'
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '0',
    borderRadius: '50%'
  }

};

const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px',
    textTransform: 'capitalize'
  };

  switch (status) {
    case 'livrée':
      return { ...baseStyle, backgroundColor: '#e6f7ee', color: '#28a745' };
    case 'en_cours':
      return { ...baseStyle, backgroundColor: '#fff8e6', color: '#ffc107' };
    case 'en_attente':
      return { ...baseStyle, backgroundColor: '#e6f0ff', color: '#007bff' };
    case 'annulée':
      return { ...baseStyle, backgroundColor: '#fde8e8', color: '#dc3545' };
    default:
      return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#6c757d' };
  }
};

export default GestionCommandes;