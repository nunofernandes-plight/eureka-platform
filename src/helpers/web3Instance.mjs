import Web3 from 'web3';
import {isProduction} from './isProduction.mjs';
const web3 = new Web3();

const initProvider = () => {
  web3.setProvider(getProvider());
};

const getProvider = () => {
  let provider;
  if (isProduction()) {
    provider = new Web3.providers.WebsocketProvider('wss://infura.io/ws');
  }
  else if (process.env.BC_NETWORK === 'ganache') {
    provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
  }
  else if (process.env.BC_NETWORK === 'kovan') {
    provider = new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws');
  }
  else {
    console.error("provider couldn't be found");
    process.exit(1);
  }
  provider.on('connect', () => console.log('Web3 Provider connected'));
  provider.on('error', e => {
    console.error('Web3 Provider Error', e);
    web3.setProvider(getProvider());
  });
  provider.on('end', e => {
    console.error('Web3 Provider Ended', e);
    web3.setProvider(getProvider());
  });
  return provider;
};

initProvider();
export default web3;
