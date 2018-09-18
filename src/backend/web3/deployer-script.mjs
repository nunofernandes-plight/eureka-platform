import deployContracts from './index.mjs';
import fs from 'fs';

import {
  finishMinting,
  mintEurekaTokens
} from '../../smartcontracts/methods/web3-token-contract-methods.mjs';
import getAccounts from '../../smartcontracts/methods/get-accounts.mjs';
import web3 from './web3Instance.mjs';

const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  await mintEKATokens(eurekaTokenContract);

  // for front-end
  const fileNames = {
    eurekaPlatform: {
      addressPath: 'src/smartcontracts/constants/GanachePlatformContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanachePlatformContractABI.json',
      abi: JSON.stringify(eurekaPlatformContract._jsonInterface),
      address: JSON.stringify(eurekaPlatformContract.options.address)
    },
    eurekaToken: {
      addressPath: 'src/smartcontracts/constants/GanacheTokenContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanacheTokenContractABI.json',
      abi: JSON.stringify(eurekaTokenContract._jsonInterface),
      address: JSON.stringify(eurekaTokenContract.options.address)
    }
  };

  await Promise.all(
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
    })
  );
  process.exit();
};

const mintEKATokens = async (eurekaTokenContract) => {
  const accounts = await getAccounts(web3);
  const contractOwner = accounts[0];
  let tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(200000000);
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
