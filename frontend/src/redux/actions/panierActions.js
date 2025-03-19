
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

// Fonction pour récupérer le panier depuis l'API
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

// Fonction pour mettre à jour la quantité dans l'API
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
    dispatch(modifierQuantite(itemId, newQuantity)); // Mettre à jour le state Redux
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

