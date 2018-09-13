import Web3 from 'web3';
import {isProduction} from '../../helpers/isProduction.mjs';
const web3 = new Web3();

const initProvider = () => {
  if (!isProduction()) {
    web3.setProvider(getProvider());
  } else {
    // TODO: initialize web3 provider with Ethereum Node hosted by DigitalOcean
  }
};

const getProvider = () => {
  const provider = new Web3.providers.WebsocketProvider(
    // 'wss://kovan.infura.io/ws'
    'ws://127.0.0.1:7545'
  );
  provider.on('connect', () => console.log('WS Connected'));
  provider.on('error', e => {
    console.error('WS Error', e);
    web3.setProvider(getProvider());
  });
  provider.on('end', e => {
    console.error('WS End', e);
    web3.setProvider(getProvider());
  });

  return provider;
};

initProvider();
export default web3;
