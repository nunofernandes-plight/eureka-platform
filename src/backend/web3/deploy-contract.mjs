import solc from 'solc';
import web3 from './web3Instance';
import linker from 'solc/linker';

export const deployContract = async (contractInput, addressMap, accounts) => {
  let input = {};
  // remove top level labels (libraries and contract)
  Object.keys(contractInput).forEach(item =>
    Object.assign(input, contractInput[item])
  );
  const compiledContract = solc.compile({sources: input}, 1);

  // await Promise.all(
  Object.keys(contractInput.contract).map(async cName => {
    const web3Contract = getWeb3Contract(cName, compiledContract);
    let bytecode = web3Contract.options.data;
    const linkReferences = linker.findLinkReferences(bytecode);

    if (linkReferences) {
      Object.keys(linkReferences).forEach(async link => {
        let libraryAddress = addressMap.get(link);

        if (libraryAddress) {
          let linkObj = {};
          linkObj[link] = libraryAddress; // example: { 'Utils.sol:Utils': '0x6EeCB98D711dbff3ceFD8F0619994BaBaCC3585b'}
          bytecode = linker.linkBytecode(bytecode, linkObj);
        }
      });
    }

    const contract = await deploy(
      web3Contract,
      bytecode,
      accounts,
      cName
    );
  });
  // );
};

// const pattern = cName.toString() + ':' + cName.split('.')[0];
// const contract = compiledContract.contracts[pattern];
// const webContract = new web3.eth.Contract(JSON.parse(contract.interface));
// let bytecode = contract.bytecode;
// const linkReferences = linker.findLinkReferences(bytecode);
//
// if (linkReferences) {
//   Object.keys(linkReferences).forEach(link => {
//     let address = patternMap.get(link);
//
//     if (address) {
//       bytecode = linker.linkBytecode(bytecode, {
//         pattern: address
//       });
//     }
//   });
// }
//
// let gasEstimated = await web3.eth.estimateGas({data: bytecode});
// await webContract
//   .deploy({data: bytecode})
//   .send({
//     from: accounts[0],
//     gas: gasEstimated
//   })
//   .once('transactionHash', hash => {})
//   .once('receipt', receipt => {})
//   .on('confirmation', (confNumber, receipt) => {})
//   .on('error', error => {})
//
//   .then(resp => {
//     console.log(
//       'Smart contract "' +
//         pattern +
//         '" has been deployed and accepted in block number ' +
//         resp.blockNumber +
//         ' (address: ' +
//         resp.contractAddress +
//         ')'
//     );
//     webContract.options.address = resp.contractAddress;
//     patternMap.set(pattern, resp.contractAddress);
//   });

export const deployLibraries = async (libraries, accounts) => {
  const compiledLibraries = solc.compile({sources: libraries}, 1);
  let addressMap = new Map();
  await Promise.all(
    Object.keys(libraries).map(async libraryName => {
      const web3Contract = getWeb3Contract(libraryName, compiledLibraries);
      const bytecode = web3Contract.options.data;
      const gasEstimated = await web3.eth.estimateGas({data: bytecode});

      const contract = await deploy(
        web3Contract,
        bytecode,
        accounts,
        libraryName
      );
      let byteCodeLink =
        libraryName.toString() + ':' + libraryName.split('.')[0];
      addressMap.set(byteCodeLink, contract.options.address);
    })
  );

  return addressMap;
};

const getWeb3Contract = (cName, compiledContract) => {
  const pattern = cName.toString() + ':' + cName.split('.')[0];
  const contract = compiledContract.contracts[pattern];
  const web3Contract = new web3.eth.Contract(JSON.parse(contract.interface));
  web3Contract.options.data = contract.bytecode;
  return web3Contract;
};

const deploy = async (web3Contract, bytecode, accounts, contractName) => {
  const gasEstimated = await web3.eth.estimateGas({data: bytecode});
  return web3Contract
    .deploy({data: bytecode})
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .on('receipt', receipt => {
      console.log(
        'Smart contract "' +
          contractName +
          '" has been deployed and accepted in block number ' +
          receipt.blockNumber +
          ' (address: ' +
          receipt.contractAddress +
          ')'
      );
    });
};
