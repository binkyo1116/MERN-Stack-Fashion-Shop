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
import _omit from 'lodash.omit';

const INITIAL_STATE = { categories: [], brands: [], sizes: [] };

export const filterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FILTER_ADD_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case FILTER_REMOVE_SEARCH_TERM:
      return _omit(state, 'searchTerm');
    case FILTER_ADD_RANGE_PRICE:
      return {
        ...state,
        priceMax: action.payload.priceMax,
        priceMin: action.payload.priceMin,
      };
    case FILTER_REMOVE_RANGE_PRICE:
      return action.payload === 'min'
        ? _omit(state, ['priceMin'])
        : _omit(state, ['priceMax']);
    case FILTER_ADD_CATEGORY:
      const category = action.payload;
      return state.categories.indexOf(category) < 0
        ? { ...state, categories: [...state.categories, category] }
        : state;
    case FILTER_REMOVE_CATEGORY:
      const newCategories = state.categories.filter(
        (category) => category !== action.payload
      );
      return { ...state, categories: newCategories };
    case FILTER_ADD_SIZE:
      return { ...state, size: action.payload };
    case FILTER_REMOVE_SIZE:
      return _omit(state, 'size');
    case FILTER_ADD_BRAND:
      const brand = action.payload;
      return state.brands.indexOf(brand) < 0
        ? { ...state, brands: [...state.brands, brand] }
        : state;
    case FILTER_REMOVE_BRAND:
      const newBrands = state.brands.filter(
        (brand) => brand !== action.payload
      );
      return { ...state, brands: newBrands };
    case FILTER_CLEAR_ALL:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
