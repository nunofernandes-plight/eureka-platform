import web3 from './web3Instance';
import {deployLibraries, deployContract} from './deploy-contract';
import getEurekaSmartContractInput from './get-input';
import getAccounts from './get-accounts';

let eurekaContract;

const deployContracts = async () => {
  console.log('Current Web3 Provider ', web3.currentProvider.host);
  const accounts = await getAccounts();
  if (web3) {
    let eurekaInput = getEurekaSmartContractInput();
    const addressMap = await deployLibraries(eurekaInput.libraries, accounts);

    [eurekaContract] = await deployContract(eurekaInput, addressMap, accounts);
  }
};

deployContracts();
export default eurekaContract;
