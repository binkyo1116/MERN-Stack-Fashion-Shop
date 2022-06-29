import axios from 'axios';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_LATEST_REQUEST,
  PRODUCT_LATEST_SUCCESS,
  PRODUCT_LATEST_FAIL,
  PRODUCT_SALE_REQUEST,
  PRODUCT_SALE_SUCCESS,
  PRODUCT_SALE_FAIL,
  PRODUCT_RELATED_REQUEST,
  PRODUCT_RELATED_FAIL,
  PRODUCT_RELATED_SUCCESS,
  PRODUCT_SORT_BY_PRICE_REQUEST,
  PRODUCT_SORT_BY_PRICE_SUCCESS,
  PRODUCT_SORT_BY_PRICE_FAIL,
  PRODUCT_SHOP_SUCCESS,
  PRODUCT_SHOP_FAIL,
  PRODUCT_SHOP_REQUEST,
  PRODUCT_SHOP_FILTER,
} from '../constants/productConstants';
import { logout } from './userActions';

export const listProducts =
  (keyword = '', pageNumber = '', option = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}&option=${option}`
      );

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/products`, product, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: message,
    });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const createProductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`/api/products/${productId}/reviews`, review, config);

      dispatch({
        type: PRODUCT_CREATE_REVIEW_SUCCESS,
      });

      dispatch(fetchProductDetails(productId));
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: PRODUCT_CREATE_REVIEW_FAIL,
        payload: message,
      });
    }
  };

export const listTopProducts =
  (pageNumber = '', perPage = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_TOP_REQUEST });

      const { data } = await axios.get(
        `/api/products/top?pageNumber=${pageNumber}&perPage=${perPage}`
      );

      dispatch({
        type: PRODUCT_TOP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_TOP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listLatestProducts = (pageNumber) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LATEST_REQUEST });

    const { data } = await axios.get(
      `/api/products/latest?pageNumber=${pageNumber}`
    );

    dispatch({
      type: PRODUCT_LATEST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LATEST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listSaleProducts = (pageNumber) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_SALE_REQUEST });

    const { data } = await axios.get(
      `/api/products/sale?pageNumber=${pageNumber}`
    );

    dispatch({ type: PRODUCT_SALE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_SALE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listRelatedProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_RELATED_REQUEST });

    const { data } = await axios.get(
      `/api/products/related?category=${category}`
    );

    dispatch({ type: PRODUCT_RELATED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_RELATED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listSortByPriceProducts =
  (sortBy, pageNumber) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_SORT_BY_PRICE_REQUEST });

      const { data } = await axios.get(
        `/api/products/price?sortBy=${sortBy}&pageNumber=${pageNumber}`
      );

      dispatch({
        type: PRODUCT_SORT_BY_PRICE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_SORT_BY_PRICE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listShopProduct =
  (type, pageNumber, keyword) => async (dispatch, getState) => {
    dispatch({ type: PRODUCT_SHOP_REQUEST });
    let payload = {};
    let error = null;

    if (keyword) {
      await dispatch(listProducts(keyword, pageNumber));
      payload = getState().productList;
      error = getState().productList.error;
    } else {
      switch (type) {
        case 'default':
          await dispatch(listProducts('', pageNumber));
          payload = getState().productList;
          error = getState().productList.error;
          break;
        case 'latest':
          await dispatch(listLatestProducts(pageNumber));
          payload = getState().productLatest;
          error = getState().productLatest.error;
          break;
        case 'rating':
          await dispatch(listTopProducts(pageNumber));
          payload = getState().productTopRated;
          error = getState().productTopRated.error;
          break;
        case 'sale':
          await dispatch(listSaleProducts(pageNumber));
          payload = getState().productSale;
          error = getState().productSale.error;
          break;
        case 'priceAsc':
          await dispatch(listSortByPriceProducts('asc', pageNumber));
          payload = getState().productSortByPrice;
          error = getState().productSortByPrice.error;
          break;
        case 'priceDesc':
          await dispatch(listSortByPriceProducts('desc', pageNumber));
          payload = getState().productSortByPrice;
          error = getState().productSortByPrice.error;
          break;
        default:
          break;
      }
    }

    dispatch({
      type: PRODUCT_SHOP_SUCCESS,
      payload,
    });

    if (error) {
      dispatch({
        type: PRODUCT_SHOP_FAIL,
        payload: error,
      });
    }
  };

export const filterListShopProduct = () => async (dispatch, getState) => {
  let filteredProducts = [];
  const filter = getState().filter;
  let { products } = getState().productShop;
  const { categories, brands, size, priceMax, priceMin } = filter;
  products = products.map((p) => ({
    ...p,
    priceSale: p.price * (1 - p.sale / 100),
  }));

  if (!categories.length && !brands.length && !size && !priceMax && !priceMin) {
    dispatch({ type: PRODUCT_SHOP_FILTER, payload: null });
    return;
  }
  if (priceMax && priceMin) {
    filteredProducts = products.filter(
      (p) => p.priceSale >= priceMin && p.priceSale <= priceMax
    );
  } else if (priceMax) {
    filteredProducts = products.filter((p) => p.priceSale <= priceMax);
  } else if (priceMin) {
    filteredProducts = products.filter((p) => p.priceSale >= priceMin);
  }
  if (categories.length) {
    filteredProducts = products.filter(
      (p) => categories.indexOf(p.category) >= 0
    );
  }
  if (size) {
    filteredProducts = products.filter((p) => {
      const availableSizes = Object.keys(p.size).filter(
        (sizeItem) => p.size[sizeItem] > 0
      );
      return availableSizes.indexOf(size) >= 0;
    });
  }
  if (brands.length) {
    filteredProducts = products.filter((p) => brands.indexOf(p.brand) >= 0);
  }
  dispatch({
    type: PRODUCT_SHOP_FILTER,
    payload: filteredProducts,
  });
};
