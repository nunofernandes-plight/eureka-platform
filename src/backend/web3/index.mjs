import web3 from './init';
import deployContract from './deploy-contract';

export default class {
  constructor() {
    console.log('Current Web3 Provider ', web3.currentProvider.host);
  }

  deployContract() {
    if (web3) {
      deployContract();
    }
  }
}
