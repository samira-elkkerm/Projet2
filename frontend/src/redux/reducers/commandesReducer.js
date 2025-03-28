const initialState = {
  commandes: [],
  loadingCommandes: false,
  errorCommandes: null,
  creatingCommande: false,
  updatingCommande: false,

  panier: {
    items: [],
    produits: [],
    loading: false,
    error: null,
  },
};

const commandeReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Gestion des commandes ---
    case "FETCH_COMMANDES_REQUEST":
      return { ...state, loadingCommandes: true, errorCommandes: null };
    case "FETCH_COMMANDES_SUCCESS":
      return { ...state, loadingCommandes: false, commandes: action.payload };
    case "FETCH_COMMANDES_FAILURE":
      return {
        ...state,
        loadingCommandes: false,
        errorCommandes: action.payload,
      };

    case "CREATE_COMMANDE_REQUEST":
      return { ...state, creatingCommande: true, errorCommandes: null };
    case "CREATE_COMMANDE_SUCCESS":
      return {
        ...state,
        creatingCommande: false,
        commandes: [...state.commandes, action.payload],
      };
    case "CREATE_COMMANDE_FAILURE":
      return {
        ...state,
        creatingCommande: false,
        errorCommandes: action.payload,
      };

    case "UPDATE_COMMANDE_REQUEST":
      return { ...state, updatingCommande: true, errorCommandes: null };
    case "UPDATE_COMMANDE_SUCCESS":
      return {
        ...state,
        updatingCommande: false,
        commandes: state.commandes.map((commande) =>
          commande.id === action.payload.id ? action.payload : commande
        ),
      };
    case "UPDATE_COMMANDE_FAILURE":
      return {
        ...state,
        updatingCommande: false,
        errorCommandes: action.payload,
      };

    case "FETCH_PANIER_REQUEST":
      return {
        ...state,
        panier: { ...state.panier, loading: true, error: null },
      };
    case "FETCH_PANIER_SUCCESS":
      return {
        ...state,
        panier: {
          ...state.panier,
          loading: false,
          items: action.payload.ligneCommandes,
          produits: action.payload.produits,
        },
      };
    case "FETCH_PANIER_FAILURE":
      return {
        ...state,
        panier: { ...state.panier, loading: false, error: action.payload },
      };
    case "MODIFIER_QUANTITE":
      return {
        ...state,
        panier: {
          ...state.panier,
          items: state.panier.items.map((item) =>
            item.id === action.payload.itemId
              ? { ...item, quantité: action.payload.newQuantity }
              : item
          ),
        },
      };

    default:
      return state;
  }
};

export default commandeReducer;
