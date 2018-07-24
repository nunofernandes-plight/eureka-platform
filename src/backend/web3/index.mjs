import web3 from './web3Instance.mjs';
import {deployLibraries, deployContract} from './deploy-contract.mjs';
import getEurekaSmartContractInput from './get-input.mjs';
import getAccounts from './get-accounts.mjs';

import methods from './web3-methods.mjs';

const deployContracts = async () => {
  console.log('Current Web3 Provider ', web3.currentProvider.connection._url);
  const accounts = await getAccounts();
  if (web3) {
    let eurekaInput = getEurekaSmartContractInput();
    const addressMap = await deployLibraries(eurekaInput.libraries, accounts);
    return deployContract(eurekaInput, addressMap, accounts);
  } else {
    console.log('Web3 Instance is not set!');
  }
};

const run = async () => {
  let [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  methods.testMethod(eurekaTokenContract, eurekaPlatformContract);
};

export default deployContracts;
//export default run;
