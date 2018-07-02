import solc from 'solc';
import web3 from './web3Instance';
import linker from 'solc/linker';
import getAccounts from './get-accounts';

export const deployContract = async input => {
  const accounts = await getAccounts();
  const compiledContract = solc.compile({sources: input}, 1);

  let patternMap = new Map();
  Object.keys(input).forEach(async cName => {
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
  });
};

export const deployLibraries = async (libraries, accounts) => {
  const compiledLibraries = solc.compile({sources: libraries}, 1);
  let addresses = [];
  await Promise.all(
    Object.keys(libraries).map(async libraryName => {
      const web3Contract = getWeb3Contract(libraryName, compiledLibraries);
      const bytecode = web3Contract.options.data;
      const gasEstimated = await web3.eth.estimateGas({data: bytecode});

      const contract = await web3Contract
        .deploy({data: bytecode})
        .send({
          from: accounts[0],
          gas: gasEstimated
        })
        .on('receipt', receipt => {
          console.log(
            'Smart contract "' +
              libraryName +
              '" has been deployed and accepted in block number ' +
              receipt.blockNumber +
              ' (address: ' +
              receipt.contractAddress +
              ')'
          );
        });
      console.log(contract.options.address);
      addresses.push(contract.options.address);
    })
  );

  return addresses;
};

const getWeb3Contract = (cName, compiledContract) => {
  const pattern = cName.toString() + ':' + cName.split('.')[0];
  const contract = compiledContract.contracts[pattern];
  const web3Contract = new web3.eth.Contract(JSON.parse(contract.interface));
  web3Contract.options.data = contract.bytecode;
  return web3Contract;
};

