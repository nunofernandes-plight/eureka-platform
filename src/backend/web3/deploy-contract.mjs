import solc from 'solc';
import web3 from './web3Instance';
import linker from 'solc/linker';
import getAccounts from './get-accounts';

const deployContract = async input => {
  let compiledContract = solc.compile({sources: input}, 1);
  console.log(compiledContract);
  let accounts = await getAccounts();

  let patternMap = new Map();
  Object.keys(input).forEach(async cName => {
    const pattern = cName.toString() + ':' + cName.split('.')[0];
    const contract = compiledContract.contracts[pattern];
    const webContract = new web3.eth.Contract(JSON.parse(contract.interface));
    let bytecode = contract.bytecode;
    const linkReferences = linker.findLinkReferences(bytecode);

    if (linkReferences) {
      Object.keys(linkReferences).forEach(link => {
        let address = patternMap.get(link);

        if (address) {
          bytecode = linker.linkBytecode(bytecode, {
            pattern: address
          });
        }
      });
    }

    let gasEstimated = await web3.eth.estimateGas({data: bytecode});
    await webContract
      .deploy({data: bytecode})
      .send({
        from: accounts[0],
        gas: gasEstimated
      })
      .then(resp => {
        console.log(
          'Smart contract "' +
            pattern +
            '" has been deployed and accepted in block number ' +
            resp.blockNumber +
            ' (address: ' +
            resp.contractAddress +
            ')'
        );
        webContract.options.address = resp.contractAddress;
        patternMap.set(pattern, resp.contractAddress);
      });
  });

  // const EurekaContract = compiledContract.contracts['Eureka.sol:Eureka'];
  // const UtilsContract = compiledContract.contracts['Utils.sol:Utils'];
  //
  // const web3EurekaContract = new web3.eth.Contract(
  //   JSON.parse(EurekaContract.interface)
  // );
  //
  // const web3UtilsContract = new web3.eth.Contract(
  //   JSON.parse(UtilsContract.interface)
  // );

  // let UtilsAddress = '';
  //
  // await web3UtilsContract
  //   .deploy({data: UtilsContract.bytecode})
  //   .send({
  //     from: accounts[0],
  //     gas: 4660727,
  //     gasPrice: 1
  //   })
  //   .on('receipt', resp => {
  //     console.log(
  //       'Smart contract "' +
  //         'Utils' +
  //         '" has been deployed and accepted in block number ' +
  //         resp.blockNumber +
  //         ' (address: ' +
  //         resp.contractAddress +
  //         ')'
  //     );
  //     UtilsAddress = resp.contractAddress;
  //   });
  //
  // // const contract =
  // //   compiledContract.contracts[Object.keys(compiledContract.contracts)[0]];
  //
  // // const linkReferences = linker.findLinkReferences(bytecode);
  // // console.log(linkReferences);
  //
  // // const myContract = new web3.eth.Contract(JSON.parse(contract.interface));
  // // const contractName = Object.keys(compiledContract.contracts)
  // //   .find(c => c.startsWith(':'))
  // //   .toString()
  // //   .substr(1);
  // //
  //
  // let bytecode = solc.linkBytecode(EurekaContract.bytecode, {
  //   'Utils.sol:Utils': UtilsAddress
  // });
  //
  // await web3EurekaContract
  //   .deploy({data: bytecode})
  //   .send({
  //     from: accounts[0],
  //     gas: 4660727,
  //     gasPrice: 1
  //   })
  //   .on('receipt', resp => {
  //     console.log(
  //       'Smart contract "' +
  //         'EUREKA' +
  //         ' has been deployed and accepted in block number ' +
  //         resp.blockNumber +
  //         ' (address: ' +
  //         resp.contractAddress +
  //         ')'
  //     );
  //     web3EurekaContract.options.address = resp.contractAddress;
  //   });
  //
  // let gasEstimated = await web3.eth.estimateGas({data: bytecode});
  //
  // console.log('Gas estimated: ' + gasEstimated);
  // await web3EurekaContract.methods
  //   .totalSupply_()
  //   .call({from: accounts[0], gas: gasEstimated})
  //   .then(succ => {
  //     console.log(succ);
  //   });
  //
  // web3UtilsContract.options.address = UtilsAddress;
};

export default deployContract;
