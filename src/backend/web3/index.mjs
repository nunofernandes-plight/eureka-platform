import web3 from './web3Instance';
import {deployLibraries} from './deploy-contract';
import getEurekaSmartContractInput from './get-input';
import getAccounts from './get-accounts';

export default class {
  constructor() {
    console.log('Current Web3 Provider ', web3.currentProvider.host);
  }

  async deployContracts() {
    const accounts = await getAccounts();
    if (web3) {
      let eurekaInput = getEurekaSmartContractInput();
      const addresses = await deployLibraries(eurekaInput.libraries, accounts);
      console.log(addresses);
    }
  }
}
