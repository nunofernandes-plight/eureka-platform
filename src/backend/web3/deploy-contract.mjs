import fs from 'fs';
import path from 'path';
import solc from 'solc';
import web3 from './init';
import getAccounts from './get-accounts';

const deployContract = async () => {
  const dirname = path.resolve(path.dirname(''));
  const file = fs.readFileSync(
    path.resolve(dirname, 'src/smartcontracts/Utils.sol'),
    'utf-8'
  );
  if (!file) {
    throw new Error(
      'Contract input file ' + file.toString() + ' is not valid!'
    );
  }

  const input = {
    'eureka.sol': fs.readFileSync(
      path.resolve(dirname, 'src/smartcontracts/eureka.sol'),
      'utf-8'
    ),
    'Utils.sol': fs.readFileSync(
      path.resolve(dirname, 'src/smartcontracts/Utils.sol'),
      'utf-8'
    ),
    'SafeMath.sol': fs.readFileSync(
      path.resolve(dirname, 'src/smartcontracts/SafeMath.sol'),
      'utf-8'
    )
  };

  let compiledContract = solc.compile({sources: input}, 1);
  let accounts = await getAccounts();

  const EurekaContract = compiledContract.contracts['eureka.sol:Eureka'];
  const UtilsContract = compiledContract.contracts['Utils.sol:Utils'];

  const web3EurekaContract = new web3.eth.Contract(
    JSON.parse(EurekaContract.interface)
  );

  const web3UtilsContract = new web3.eth.Contract(
    JSON.parse(UtilsContract.interface)
  );

  let UtilsAddress = '';

  await web3UtilsContract
    .deploy({data: UtilsContract.bytecode})
    .send({
      from: accounts[0],
      gas: 4660727,
      gasPrice: 1
    })
    .on('receipt', resp => {
      console.log(
        'Smart contract "' +
          'Utils' +
          '" has been deployed and accepted in block number ' +
          resp.blockNumber +
          ' (address: ' +
          resp.contractAddress +
          ')'
      );
      UtilsAddress = resp.contractAddress;
    });

  //console.log(compiledContract);

  //const compiledContract = solc.compile(file, 1);

  // if (compiledContract.errors) {
  //   console.log(compiledContract.errors[0]);
  // }
  // const contract =
  //   compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];

  // const linkReferences = linker.findLinkReferences(bytecode);
  // console.log(linkReferences);

  // const myContract = new web3.eth.Contract(JSON.parse(contract.interface));
  // const contractName = Object.keys(compiledContract.contracts)
  //   .find(c => c.startsWith(':'))
  //   .toString()
  //   .substr(1);
  //

  let bytecode = solc.linkBytecode(EurekaContract.bytecode, {
    'Utils.sol:Utils': '0xB5aA5B106a09f6448D28000b88b6294c7325bAE4'
  });

  //console.log(bytecode);
  // const hacked = bytecode.replace(new RegExp())

  await web3EurekaContract
    .deploy({data: bytecode})
    .send({
      from: accounts[0],
      gas: 4660727,
      gasPrice: 1
    })
    .on('receipt', resp => {
      console.log(
        'Smart contract "' +
          'EUREKA' +
          ' has been deployed and accepted in block number ' +
          resp.blockNumber +
          ' (address: ' +
          resp.contractAddress +
          ')'
      );
      web3EurekaContract.options.address = resp.contractAddress;
    });

  let gasEstimated = await web3.eth.estimateGas({data: bytecode});

  console.log('Gas estimated: ' + gasEstimated);
  await web3EurekaContract.methods
    .totalSupply_()
    .call({from: accounts[0], gas: gasEstimated})
    .then(succ => {
      console.log(succ);
    });

  web3UtilsContract.options.address = UtilsAddress;
};

export default deployContract;
