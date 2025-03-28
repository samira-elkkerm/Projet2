import api from "../../api";
export const FETCH_COMMANDES_REQUEST = "FETCH_COMMANDES_REQUEST";
export const FETCH_COMMANDES_SUCCESS = "FETCH_COMMANDES_SUCCESS";
export const FETCH_COMMANDES_FAILURE = "FETCH_COMMANDES_FAILURE";

export const CREATE_COMMANDE_REQUEST = "CREATE_COMMANDE_REQUEST";
export const CREATE_COMMANDE_SUCCESS = "CREATE_COMMANDE_SUCCESS";
export const CREATE_COMMANDE_FAILURE = "CREATE_COMMANDE_FAILURE";

export const UPDATE_COMMANDE_REQUEST = "UPDATE_COMMANDE_REQUEST";
export const UPDATE_COMMANDE_SUCCESS = "UPDATE_COMMANDE_SUCCESS";
export const UPDATE_COMMANDE_FAILURE = "UPDATE_COMMANDE_FAILURE";

export const fetchCommandesRequest = () => ({ type: FETCH_COMMANDES_REQUEST });
export const fetchCommandesSuccess = (commandes) => ({
  type: FETCH_COMMANDES_SUCCESS,
  payload: commandes,
});
export const fetchCommandesFailure = (error) => ({
  type: FETCH_COMMANDES_FAILURE,
  payload: error,
});

export const createCommandeRequest = () => ({ type: CREATE_COMMANDE_REQUEST });
export const createCommandeSuccess = (commande) => ({
  type: CREATE_COMMANDE_SUCCESS,
  payload: commande,
});
export const createCommandeFailure = (error) => ({
  type: CREATE_COMMANDE_FAILURE,
  payload: error,
});

export const updateCommandeRequest = () => ({ type: UPDATE_COMMANDE_REQUEST });
export const updateCommandeSuccess = (commande) => ({
  type: UPDATE_COMMANDE_SUCCESS,
  payload: commande,
});
export const updateCommandeFailure = (error) => ({
  type: UPDATE_COMMANDE_FAILURE,
  payload: error,
});

export const fetchCommandes = () => async (dispatch) => {
  dispatch(fetchCommandesRequest());
  try {
    const response = await fetch("http://127.0.0.1:8000/api/commandes");
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    dispatch(fetchCommandesSuccess(data));
  } catch (error) {
    dispatch(fetchCommandesFailure(error.message));
  }
};

export const createCommande = (commandeData) => async (dispatch) => {
  dispatch({ type: "CREATE_COMMANDE_REQUEST" });
  try {
    const response = await api.post("/commandes", commandeData);
    dispatch({
      type: "CREATE_COMMANDE_SUCCESS",
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: "CREATE_COMMANDE_FAILURE",
      payload:
        error.response?.data?.message || "Erreur de création de commande",
    });
    throw error;
  }
};

// Autres actions pour les commandes...

export const updateCommande = (id, commandeData) => async (dispatch) => {
  dispatch(updateCommandeRequest());
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/commandes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeData),
    });
    if (!response.ok) throw new Error("Échec de la mise à jour");
    const updatedCommande = await response.json();
    dispatch(updateCommandeSuccess(updatedCommande));
  } catch (error) {
    dispatch(updateCommandeFailure(error.message));
  }
};

// Action spéciale pour créer une commande à partir du panier
export const createCommandeFromPanier = (panierItems) => async (dispatch) => {
  const commandeData = {
    date_commande: new Date().toISOString(),
    statut: "en_attente",
    items: panierItems.map((item) => ({
      produit_id: item.produit.id,
      quantité: item.quantité,
      prix_unitaire: item.produit.prix,
    })),
  };

  try {
    const newCommande = await dispatch(createCommande(commandeData));
    // Optionnel : vider le panier après création
    // dispatch(viderPanier());
    return newCommande;
  } catch (error) {
    console.error("Erreur création commande:", error);
    throw error;
  }
};
