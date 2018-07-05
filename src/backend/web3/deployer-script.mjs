import deployContracts from './index.mjs';
import getAccounts from './get-accounts.mjs';
let eurekaContract;
const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  await deployContracts();
};

deploy();
