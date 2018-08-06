import deployContracts from './index.mjs';
import fs from 'fs';

const deploy = async () => {
  // deployContracts will deploy all libraries specified in the input file and once they
  // get a valid Ethereum address, all the smart contracts gets also deployed.
  // the method returns a web3 instance of the smart contract itself.
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  const abi = eurekaPlatformContract._jsonInterface;

  const fileName = 'src/frontend/web3/eureka-ABI.json';
  fs.writeFileSync(fileName, JSON.stringify(abi), function(err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log('ABI has been written in ' + fileName);
  process.exit(0);
};

deploy();
