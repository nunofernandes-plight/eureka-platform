import fs from 'fs';
import path from 'path';
import solc from 'solc';
import web3 from './init';

const deployContract = async () => {
  // const compiledContract = solc.compile(
  //   fs.readFileSync(
  //     '/Users/LuckyP/Desktop/matters/eureka-platform/src/frontend/ethereum/truffle/contracts/Utils.sol', 'utf-8'
  //   ),
  //   1
  // );
  // if (compiledContract.errors) {
  //   throw new Error(compiledContract.errors[0]);
  // }
  // const contract =
  //   compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];

  const dirname = path.resolve(path.dirname(''));
  const file = fs.readFileSync(
    path.resolve(
        dirname,
      "src/smartcontract/SafeMath.sol"
    ),
    'utf-8'
  );

  const compiledContract = solc.compile(file, 1);

  const contract =
    compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];
  const myContract = new web3.eth.Contract(JSON.parse(contract.interface));

  console.log(compiledContract.contracts);

  myContract
    .deploy({data: contract.bytecode})
    .send({
      from: '0x94C5fE31Ec15A4e55679155de555e22903D7156b',
      gas: 4660727,
      gasPrice: 1
    })
    .on('receipt', resp => {
      console.log(
        'Smart contract "' +
          contract.contractName +
          '" has been deployed and accepted in block number ' +
          resp.blockNumber +
          ' (address: ' +
          resp.contractAddress +
          ')'
      );
    });
};

export default deployContract;
