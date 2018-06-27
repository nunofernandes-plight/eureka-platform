import web3 from './init';
import deployContract from './deploy-contract';

export default class {
  constructor() {
    console.log('Current provider ', web3.currentProvider.host);
  }

  deployContract() {
    deployContract();
  }
}
