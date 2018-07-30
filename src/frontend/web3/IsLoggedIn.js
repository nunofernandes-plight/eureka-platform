import {MetaMaskStatus} from './MetaMaskStatus.js';

export const getMetaMaskStatus = async web3 => {
  return web3.eth
    .getAccounts()
    .then(accounts => {
      if (accounts.length === 0) {
        return MetaMaskStatus.DETECTED_NO_LOGGED_IN;
      } else {
        return MetaMaskStatus.DETECTED_LOGGED_IN;
      }
    })
    .catch(err => {
      console.error('An error with getMetaMaskStatus() occurred: ' + err);
      return MetaMaskStatus.NO_DETECTED;
    });
};
