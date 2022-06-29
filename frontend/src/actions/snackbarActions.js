import { SNACKBAR_CLEAR, SNACKBAR_OPEN } from '../constants/snackbarConstants';

export const openSnackbar = (message, variant, link = { hasLink: false }) => {
  return {
    type: SNACKBAR_OPEN,
    payload: { message, variant, link },
  };
};

export const clearSnackbar = () => {
  return {
    type: SNACKBAR_CLEAR,
  };
};
