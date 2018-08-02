import web3 from '../backend/web3/web3Instance.mjs';

export const isValidAddress = address => {
  return web3.utils.isAddress(address);
};
