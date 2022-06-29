import {
  FILTER_ADD_SEARCH_TERM,
  FILTER_REMOVE_SEARCH_TERM,
  FILTER_ADD_RANGE_PRICE,
  FILTER_REMOVE_RANGE_PRICE,
  FILTER_ADD_CATEGORY,
  FILTER_REMOVE_CATEGORY,
  FILTER_ADD_SIZE,
  FILTER_REMOVE_SIZE,
  FILTER_ADD_BRAND,
  FILTER_REMOVE_BRAND,
  FILTER_CLEAR_ALL,
} from '../constants/filterConstants';

export const addSearchTerm = (term) => ({
  type: FILTER_ADD_SEARCH_TERM,
  payload: term,
});

export const removeSearchTerm = () => ({
  type: FILTER_REMOVE_SEARCH_TERM,
});

export const addRangePrice = (range) => (dispatch, getState) => {
  dispatch({
    type: FILTER_ADD_RANGE_PRICE,
    payload: range,
  });
};

export const removeRangePrice = (price) => ({
  type: FILTER_REMOVE_RANGE_PRICE,
  payload: price,
});

export const addCategories = (categories) => ({
  type: FILTER_ADD_CATEGORY,
  payload: categories,
});

export const removeCategory = (category) => ({
  type: FILTER_REMOVE_CATEGORY,
  payload: category,
});

export const addSize = (size) => ({
  type: FILTER_ADD_SIZE,
  payload: size,
});

export const removeSize = () => ({
  type: FILTER_REMOVE_SIZE,
});

export const addBrands = (brands) => ({
  type: FILTER_ADD_BRAND,
  payload: brands,
});

export const removeBrand = (brand) => ({
  type: FILTER_REMOVE_BRAND,
  payload: brand,
});

export const filterClearAll = () => ({
  type: FILTER_CLEAR_ALL,
});
