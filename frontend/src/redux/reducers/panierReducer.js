
export const fetchPanierRequest = () => ({ type: 'FETCH_PANIER_REQUEST' });
export const fetchPanierSuccess = (data) => ({
  type: 'FETCH_PANIER_SUCCESS',
  payload: data,
});
export const fetchPanierFailure = (error) => ({
  type: 'FETCH_PANIER_FAILURE',
  payload: error,
});

export const modifierQuantite = (itemId, newQuantity) => ({
  type: 'MODIFIER_QUANTITE',
  payload: { itemId, newQuantity },
});

// Function to fetch the cart from the API
export const fetchPanier = () => async (dispatch) => {
  dispatch(fetchPanierRequest());
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ligne-commandes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    dispatch(fetchPanierSuccess(data));
  } catch (error) {
    dispatch(fetchPanierFailure(error.message));
  }
};

// Function to update the quantity in the API
export const updateQuantity = (itemId, newQuantity) => async (dispatch) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/ligne-commandes/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantité: newQuantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    const data = await response.json();
    console.log('Quantity updated successfully:', data);
    dispatch(modifierQuantite(itemId, newQuantity)); // Update Redux state
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

const initialPanierState = {
  panier: [],
  produits: [],
  loading: false,
  error: null,
};

const panierReducer = (state = initialPanierState, action) => {
  switch (action.type) {
    case 'FETCH_PANIER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_PANIER_SUCCESS':
      return {
        ...state,
        loading: false,
        panier: action.payload.ligneCommandes,
        produits: action.payload.produits,
      };
    case 'FETCH_PANIER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'MODIFIER_QUANTITE':
      return {
        ...state,
        panier: state.panier.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, quantité: action.payload.newQuantity }
            : item
        ),
      };
    default:
      return state;
  }
};

export default panierReducer;
