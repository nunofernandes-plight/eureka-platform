import contractEventListener from './contract-event-lister.mjs';
import web3 from '../../helpers/web3Instance.mjs';
import GanachePlatformContractABI from '../../smartcontracts/constants/GanachePlatformContractABI.json';
import GanachePlatformContractAddress from '../../smartcontracts/constants/GanachePlatformContractAddress.json';
import GanacheTokenContractAddress from '../../smartcontracts/constants/GanacheTokenContractAddress.json';
import GanacheTokenContractABI from '../../smartcontracts/constants/GanacheTokenContractABI.json';
import {isProduction} from '../../helpers/isProduction.mjs';
import {
  PLATFORM_MAIN_ADDRESS,
  TOKEN_MAIN_ADDRESS
} from '../../smartcontracts/constants/MainNetworkContractAddresses.mjs';
import {PLATFORM_MAIN_ABI} from '../../smartcontracts/constants/MainNetworkPlatformContractABIs.mjs';
import {TOKEN_MAIN_ABI} from '../../smartcontracts/constants/MainNetworkTokenContractABIs.mjs';
import {PLATFORM_KOVAN_ADDRESS, TOKEN_KOVAN_ADDRESS} from '../../smartcontracts/constants/KovanContractAddresses.mjs';
import {PLATFORM_KOVAN_ABI} from '../../smartcontracts/constants/KovanPlatformContractABIs.mjs';
import {TOKEN_KOVAN_ABI} from '../../smartcontracts/constants/KovanTokenContractABIs.mjs';
import {writeContractOwnerInDB} from '../db/contract-owner-service.mjs';

export let platformContract;
export let tokenContract;

export const setupWeb3Interface = () => {

  let platformContractAddress;
  let platformContractABI;
  let tokenContractAddress;
  let tokenContractABI;
  if (isProduction()) {
    platformContractAddress = PLATFORM_MAIN_ADDRESS;
    platformContractABI = PLATFORM_MAIN_ABI;
    tokenContractAddress = TOKEN_MAIN_ADDRESS;
    tokenContractABI = TOKEN_MAIN_ABI;
  }
  else if (process.env.BC_NETWORK === 'ganache') {
    platformContractAddress = GanachePlatformContractAddress;
    platformContractABI = GanachePlatformContractABI;
    tokenContractAddress = GanacheTokenContractAddress;
    tokenContractABI = GanacheTokenContractABI;
  }
  else if (process.env.BC_NETWORK === 'kovan') {
    platformContractAddress = PLATFORM_KOVAN_ADDRESS;
    platformContractABI = PLATFORM_KOVAN_ABI;
    tokenContractAddress = TOKEN_KOVAN_ADDRESS;
    tokenContractABI = TOKEN_KOVAN_ABI;
  }
  else {
    console.error("provider couldn't be found");
    process.exit(1);
  }

  platformContract = new web3.eth.Contract(platformContractABI, platformContractAddress);
  tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);

  contractEventListener.setup(platformContract);
  writeContractOwnerInDB(platformContract);


  /** Pending Transaction listener **/
  web3.eth.subscribe('pendingTransactions')
    .on('data', async (transactionHash) => {
      console.log(transactionHash);
      const transaction = await web3.eth.getTransaction(transactionHash);
      if ( transaction
        && ( transaction.to === platformContract.options.address
          || transaction.from === platformContract.options.address
          || transaction.to === tokenContract.options.address
        )
      ) {

        //TODO save transaction because related with platform
        // check status firs if transaction receipt call is necessary
        const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
        console.log(transactionReceipt);
      }
    });

};

