import {
  CART_ADD_ITEM,
  CART_OPEN_DRAWER_PREVIEW,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';
import axios from 'axios';

export const addToCart = (id, qty, size) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      name: data.name,
      qty: qty,
      sizeSelected: size,
      size: data.size,
      images: data.images,
      price: data.price,
      sale: data.sale,
      priceSale: data.price * (1 - data.sale / 100),
      product: data._id,
      countInStock: data.countInStock,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const setOpenCartDrawer = (isOpen) => {
  return { type: CART_OPEN_DRAWER_PREVIEW, payload: isOpen };
};
