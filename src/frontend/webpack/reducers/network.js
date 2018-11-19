import {getNetwork} from '../../web3/Helpers.js';
import {SET_NETWORK} from './types.js';

export const updateNetwork = web3 => {
  return async dispatch => {
    const network = await getNetwork(web3);
    dispatch({type: SET_NETWORK, network});
  };
};

export const networkData = (state = {}, action) => {
  switch (action.type) {
    case SET_NETWORK:
      return {
        network: action.network
      };
    default:
      return state;
  }
};
