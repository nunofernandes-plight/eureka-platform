import fs from 'fs';
import solc from 'solc';
import web3 from '../../src/backend/web3/web3Instance.mjs';

// //dependent files
const input = {
  'SafeMath.sol': fs.readFileSync('./src/smartcontracts/contracts/SafeMath.sol', 'utf8'),
  'Utils.sol': fs.readFileSync('./src/smartcontracts/contracts/Utils.sol', 'utf8'),
  'Eureka.sol': fs.readFileSync('./src/smartcontracts/contracts/Eureka.sol', 'utf8'),
  'EurekaPlatform.sol': fs.readFileSync('./src/smartcontracts/contracts/EurekaPlatform.sol', 'utf8')
};
const output = solc.compile({sources: input}, 1);
const abi = JSON.parse(output.contracts['EurekaPlatform.sol:EurekaPlatform'].interface);
let EurekaPlatformContract = undefined;
let account = undefined;

export default {
  setup: async (contractAdress) => {
    return web3.eth.getAccounts()
      .then(accounts => {
        EurekaPlatformContract = new web3.eth.Contract(abi);
        EurekaPlatformContract.options.address = contractAdress;
        account = accounts[0];
        console.log('Account' + account);
        return account;
      });
  },
  signUpTestEditor: () => {
    if (EurekaPlatformContract) {
      EurekaPlatformContract.methods.signUpEditor(account).send({
        from: account,
        gas: 4678127 //TODO change amount to sth which makes sense
      })
        .on('transactionHash', tx => {
          //this.addNewTx(tx, game.id, Status.GAME_JOINED);
          // this.setLoadingToTrue(game);
        })
        .on('receipt', res => {
          //console.log(res);
          console.log('Successful Editor Sign up for address ' + account + '.   ' + res);
        })
        .on('confirmation', function(confirmationNr) {
          // is returned for the first 24 block confirmations
        });
    } else {
      throw new Error('No setup Contract Method Tester - set it up with an adress');
    }
  }
};