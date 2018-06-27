import fs from 'fs';
import path from 'path';
import solc from 'solc';

const deployContract = async () => {
  const dirname = path.resolve(path.dirname(''));
  const file = fs.readFileSync(
    path.resolve(dirname, 'src/smartcontracts/eureka.sol'),
    'utf-8'
  );
  if (!file) {
    throw new Error(
      'Contract input file ' + file.toString() + ' is not valid!'
    );
  }

  // const input = {
  //   'eureka.sol': fs.readFileSync(
  //     path.resolve(dirname, 'src/smartcontracts/eureka.sol'),
  //     'utf8'
  //   )
  // };

  const SafeMathAddress = '0x713D1A0b03d66Da796BD6F0e5Fa77E7aa031c8FA'; //eslint-disable-line
  const UtilsAddress = '0x7F117faAFBe1Ce1925B30d9347A190621a5bF2f6'; //eslint-disable-line

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

  let compiledContract = solc.compile({sources: input}, 1); //eslint-disable-line

  //console.log(compiledContract);

  //const compiledContract = solc.compile(file, 1);

  // if (compiledContract.errors) {
  //   console.log(compiledContract.errors[0]);
  // }
  // const contract =
  //   compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];

  // let bytecode = linker.linkBytecode(contract.bytecode, {"Utils": UtilsAddress});
  // bytecode = linker.linkBytecode(bytecode, {"SafeMath": SafeMathAddress});

  // const myContract = new web3.eth.Contract(JSON.parse(contract.interface));
  // const contractName = Object.keys(compiledContract.contracts)
  //   .find(c => c.startsWith(':'))
  //   .toString()
  //   .substr(1);
  //
  // let accounts = await getAccounts();
  //
  // myContract
  //   .deploy({data: contract.bytecode})
  //   .send({
  //     from: accounts[0],
  //     gas: 4660727,
  //     gasPrice: 1
  //   })
  //   .on('receipt', resp => {
  //     console.log(
  //       'Smart contract "' +
  //         contractName +
  //         '" has been deployed and accepted in block number ' +
  //         resp.blockNumber +
  //         ' (address: ' +
  //         resp.contractAddress +
  //         ')'
  //     );
  //   });
};

export default deployContract;
