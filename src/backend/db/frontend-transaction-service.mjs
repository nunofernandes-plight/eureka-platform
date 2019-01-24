import FrontendTransaction from '../schema/frontend-transaction.mjs';
import userService from './user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import web3 from '../../helpers/web3Instance.mjs';
import TRANSACTION_STATUS from '../../helpers/TransactionStatus.mjs';

export default {
  addTransaction: async (userAddress, transactionType, timestamp, txHash) => {
    let user = await userService.getUserByEthereumAddress(userAddress);
    if (!user)
      return errorThrower.noEntryFoundById(
        'SC Transactions service: ' + userAddress
      );
    const tx = new FrontendTransaction({
      ownerAddress: userAddress,
      transactionType: transactionType,
      timestamp: timestamp,
      txHash: txHash
    });
    await tx.save();
    return tx._id;
  },
  getAllTxs: async address => {
    let txs = await FrontendTransaction.find({
      ownerAddress: address
    });
    if (txs.length === 0) {
      return txs;
    }

    // TODO: ADJUST THIS FOR TRANSACTION RECEIPT COMING FROM METAMASK
    let data = [];
    await Promise.all(
      txs.map(async tx => {
        let nexTx = {...tx}._doc;
        await web3.eth
          .getTransactionReceipt(tx.txHash)
          .then(receipt => {
            if (receipt) {
              if (receipt.status) {
                nexTx.status = TRANSACTION_STATUS.COMPLETED;
              } else {
                nexTx.status = TRANSACTION_STATUS.ERROR;
              }
            } else {
              nexTx.status = TRANSACTION_STATUS.IN_PROGRESS;
            }
          })
          .catch(reason => {
            console.log(reason);
            nexTx.status = TRANSACTION_STATUS.ERROR;
            return errorThrower.internalError(reason);
          });
        return data.push(nexTx);
      })
    );
    return data;
  }
};
