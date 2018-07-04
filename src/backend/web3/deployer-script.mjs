import deployContracts from './index.mjs';
import getAccounts from './get-accounts.mjs';
let eurekaContract;
const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  const [eurekaContract] = await deployContracts();
  //methods(eurekaContract);
};

const methods = async eurekaContract => {
  const accounts = await getAccounts();
  const totalSupply = await totalSupply(accounts, eurekaContract);
  console.log(totalSupply);
};

const totalSupply = async (accounts, eurekaContract) => {
  return eurekaContract.methods
    .totalSupply()
    .call({from: accounts[0]})
    .then(succ => {
      return succ;
    });
};

deploy();
