import { SNACKBAR_CLEAR, SNACKBAR_OPEN } from '../constants/snackbarConstants';

export const snackbarReducer = (
  state = { isOpen: false, link: { hasLink: false } },
  action
) => {
  switch (action.type) {
    case SNACKBAR_OPEN:
      return {
        isOpen: true,
        message: action.payload.message,
        variant: action.payload.variant,
        link: action.payload.link,
      };
    case SNACKBAR_CLEAR:
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};
