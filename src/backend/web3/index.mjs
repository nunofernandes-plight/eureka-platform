import web3 from './web3Instance';
import deployContract from './deploy-contract';
import getEurekaSmartContractInput from './get-input';

export default class {
  constructor() {
    console.log('Current Web3 Provider ', web3.currentProvider.host);
  }

  deployContracts() {
    if (web3) {
      let eurekaInput = getEurekaSmartContractInput();
      let eurekaInstance = deployContract(eurekaInput);
    }
  }
}
