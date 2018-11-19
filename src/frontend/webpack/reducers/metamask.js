import {getMetaMaskStatus} from '../../web3/IsLoggedIn.js';
import {SET_METAMASK} from './types.js';

export const updateMetaMask = web3 => {
  return async dispatch => {
    const status = await getMetaMaskStatus(web3);
    dispatch({type: SET_METAMASK, status});
  };
};

export const metamaskData = (state = {}, action) => {
  switch (action.type) {
    case SET_METAMASK:
      return {
        status: action.status
      };
    default:
      return state;
  }
};
