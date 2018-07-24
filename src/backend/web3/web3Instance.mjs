import Web3 from 'web3';
import isProduction from '../../helpers/isProduction.mjs';
const web3 = new Web3();

const initProvider = () => {
  if (!isProduction()) {
    web3.setProvider(
      new web3.providers.WebsocketProvider('http://127.0.0.1:7545')
    ); //changed to Websocket, as HttpProvider is deprecated
  } else {
    // TODO: initialize web3 provider with Ethereum Node hosted by DigitalOcean
  }
};

initProvider();
export default web3;
