import web3 from './web3Instance.mjs';
import {deployLibraries, deployContract} from './deploy-contract.mjs';
import getEurekaSmartContractInput from './get-input.mjs';
import getAccounts from './get-accounts.mjs';



const deployContracts = async () => {
  console.log('Current Web3 Provider ', web3.currentProvider.host);
  const accounts = await getAccounts();
  if (web3) {
    let eurekaInput = getEurekaSmartContractInput();
    const addressMap = await deployLibraries(eurekaInput.libraries, accounts);

    return deployContract(eurekaInput, addressMap, accounts);
  }

};

export default deployContracts;
