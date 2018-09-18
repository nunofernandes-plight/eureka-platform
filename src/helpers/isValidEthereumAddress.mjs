import web3 from './web3Instance.mjs';

export const isValidAddress = address => {
  return web3.utils.isAddress(address);
};
