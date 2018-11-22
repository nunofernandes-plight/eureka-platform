import {getDomain} from '../../../helpers/getDomain.mjs';
import {ADDED_TX, ADDING_TX, ERROR_ADDING_TX} from './types.js';

const initialState = {addingTxLoading: true, txs: null};

export const addTransaction = (type, tx) => {
  return dispatch => {
    dispatch({type: ADDING_TX});
    fetch(`${getDomain()}/api/frontendtransactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        txHash: tx,
        type
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({
            type: ADDED_TX,
            _id: response.data
          });
        } else {
          dispatch({
            type: ERROR_ADDING_TX,
            error: response.error
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: ERROR_ADDING_TX
        });
      });
  };
};

export const transactionsData = (state = initialState, action) => {
  switch (action.type) {
    case ADDING_TX:
      return {
        addingTxLoading: true
      };
    case ADDED_TX:
      return {
        addingTxLoading: false,
        _id: action._id
      };
    case ERROR_ADDING_TX:
      return {
        addingTxLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};
