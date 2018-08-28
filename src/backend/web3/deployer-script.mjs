import deployContracts from './index.mjs';
import fs from 'fs';
import app from '../../../src/backend/api/api.mjs';

import {
  finishMinting,
  mintEurekaTokens
} from './web3-token-contract-methods.mjs';
import getAccounts from './get-accounts.mjs';

const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  await setup(eurekaTokenContract, eurekaPlatformContract);

  app.setupApp(eurekaPlatformContract);
  app.listenTo(process.env.PORT || 8080);


  // for front-end
  const fileNames = {
    eurekaPlatform: {
      addressPath: 'src/frontend/web3/eurekaPlatform-Address.json',
      abiPath: 'src/frontend/web3/eurekaPlatform-ABI.json',
      abi: JSON.stringify(eurekaPlatformContract._jsonInterface),
      address: JSON.stringify(eurekaPlatformContract.options.address)
    },
    eurekaToken: {
      addressPath: 'src/frontend/web3/eurekaToken-Address.json',
      abiPath: 'src/frontend/web3/eurekaToken-ABI.json',
      abi: JSON.stringify(eurekaTokenContract._jsonInterface),
      address: JSON.stringify(eurekaTokenContract.options.address)
    }
  };

  Object.keys(fileNames).map(contract => {
    fs.writeFileSync(
      fileNames[contract].abiPath,
      fileNames[contract].abi,
      function(err) {
        if (err) {
          return console.log(err);
        } else {
          console.log('ABI has been written in ' + contract.path);
        }
      }
    );

    fs.writeFileSync(
      fileNames[contract].addressPath,
      fileNames[contract].address,
      function(err) {
        if (err) {
          return console.log(err);
        } else {
          console.log('ABI has been written in ' + contract.path);
        }
      }
    );
  });
};

const setup = async (eurekaTokenContract, eurekaPlatformContract) => {
  const accounts = await getAccounts();
  const contractOwner = accounts[0];
  let tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(20000);
  });
  await mintEurekaTokens(
    eurekaTokenContract,
    accounts,
    tokenAmounts,
    contractOwner
  );
  await finishMinting(eurekaTokenContract, contractOwner);
  console.log('The EKA token minting has been finished.');
};

deploy();
