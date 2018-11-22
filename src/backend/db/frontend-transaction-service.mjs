import FrontendTransaction from '../schema/frontend-transaction.mjs';
import userService from './user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ScTransaction from '../schema/sc-transaction.mjs';

export default {
  addTransaction: async (userAddress, transactionType, timestamp, txHash) => {
    let user = await userService.getUserByEthereumAddress(userAddress);
    if (!user)
      errorThrower.noEntryFoundById('SC Transactions service: ' + userAddress);
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
    const tx = await FrontendTransaction.find({
      ownerAddress: address
    });
    if (!tx) errorThrower.noEntryFoundById(address);
    return tx;
  },
  deleteTransaction: async userAddress => {}
};
