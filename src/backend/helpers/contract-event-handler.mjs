import fs from 'fs';
import solc from 'solc';
import web3 from '../web3/web3Instance';
import userService from '../db/user-service';

// //dependent files
const input = {
  'SafeMath.sol': fs.readFileSync('./src/smartcontracts/contracts/SafeMath.sol', 'utf8'),
  'Utils.sol': fs.readFileSync('./src/smartcontracts/contracts/Utils.sol', 'utf8'),
  'Eureka.sol': fs.readFileSync('./src/smartcontracts/contracts/Eureka.sol', 'utf8'),
  'EurekaPlatform.sol': fs.readFileSync('./src/smartcontracts/contracts/EurekaPlatform.sol', 'utf8')
};
const output = solc.compile({sources: input}, 1);
const abi = JSON.parse(output.contracts['EurekaPlatform.sol:EurekaPlatform'].interface);

export default {
  setup: (contractAddress) => {
    // setup connection ot contract
    const EurekaPlatformContract = new web3.eth.Contract(abi);
    EurekaPlatformContract.options.address = contractAddress;

    //sign in for events
    EurekaPlatformContract.events.EditorSignUp(undefined, (error, event) => {
      if (error) throw error;
      userService.makeEditor(event.returnValues.editorAdress);
    });
  }
};
