import deployContracts from './index.mjs';
import fs from 'fs';

const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();

  const fileNames = {
    eurekaPlatform: {
      path: 'src/frontend/web3/eurekaPlatform-ABI.json',
      abi: JSON.stringify(eurekaPlatformContract._jsonInterface)
    },
    eurekaToken: {
      path: 'src/frontend/web3/eurekaToken-ABI.json',
      abi: JSON.stringify(eurekaTokenContract._jsonInterface)
    }
  };

  Object.keys(fileNames).map(contract => {
    fs.writeFileSync(
      fileNames[contract].path,
      fileNames[contract].abi,
      function(err) {
        if (err) {
          return console.log(err);
        } else {
          console.log('ABI has been written in ' + contract.path);
        }
      }
    );
  });

  process.exit(0);
};

deploy();
