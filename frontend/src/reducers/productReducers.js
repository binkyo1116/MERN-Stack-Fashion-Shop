import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
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
  PRODUCT_RELATED_SUCCESS,
  PRODUCT_RELATED_FAIL,
  PRODUCT_SORT_BY_PRICE_REQUEST,
  PRODUCT_SORT_BY_PRICE_SUCCESS,
  PRODUCT_SORT_BY_PRICE_FAIL,
  PRODUCT_SHOP_REQUEST,
  PRODUCT_SHOP_SUCCESS,
  PRODUCT_SHOP_FAIL,
  PRODUCT_SHOP_FILTER,
} from '../constants/productConstants';

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      const { products, page, pages, count } = action.payload;
      return { loading: false, products, page, pages, count };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return { product: {} };
    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_REVIEW_RESET:
      return {};
    default:
      return state;
  }
};

export const productTopRatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_TOP_SUCCESS:
      const { products, page, pages, count } = action.payload;
      return { loading: false, products, page, pages, count };
    case PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productLatestReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LATEST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LATEST_SUCCESS:
      const { products, page, pages, count } = action.payload;
      return { loading: false, products, page, pages, count };
    case PRODUCT_LATEST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productSaleReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_SALE_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_SALE_SUCCESS:
      const { page, pages, products, count } = action.payload;
      return { loading: false, page, pages, products };
    case PRODUCT_SALE_FAIL:
      return { loading: false, error: action.payload, count };
    default:
      return state;
  }
};

export const productRelatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_RELATED_REQUEST:
      return { loading: true };
    case PRODUCT_RELATED_SUCCESS:
      const { page, pages, products } = action.payload;
      return { loading: false, page, pages, products };
    case PRODUCT_RELATED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productSortByPriceReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_SORT_BY_PRICE_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_SORT_BY_PRICE_SUCCESS:
      const { page, pages, products, count } = action.payload;
      return { loading: false, page, pages, products, count };
    case PRODUCT_SORT_BY_PRICE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productShopReducer = (
  state = { products: [], tempProducts: [], page: 1, pages: 1 },
  action
) => {
  switch (action.type) {
    case PRODUCT_SHOP_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_SHOP_SUCCESS:
      const { page, pages, products, count } = action.payload;
      return {
        loading: false,
        page,
        pages,
        products,
        tempProducts: products,
        count,
      };
    case PRODUCT_SHOP_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_SHOP_FILTER:
      return action.payload
        ? {
            ...state,
            products: action.payload,
          }
        : { ...state, products: state.tempProducts };
    default:
      return state;
  }
};
