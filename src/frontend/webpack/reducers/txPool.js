import {CLOSE_MODAL, OPEN_MODAL, TOGGLE_MODAL} from './types.js';

export const openTxModal = () => {
  return dispatch => {
    dispatch({type: OPEN_MODAL});
  };
};
export const closeTxModal = () => {
  return dispatch => {
    dispatch({type: CLOSE_MODAL});
  };
};
export const toggleTxModal = () => {
  return dispatch => {
    dispatch({type: TOGGLE_MODAL});
  };
};
export const txModalData = (open = false, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return true;
    case CLOSE_MODAL:
      return false;
    case TOGGLE_MODAL:
      return !open;
    default:
      return open;
  }
};
