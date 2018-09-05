import errorThrower from '../helpers/error-thrower.mjs';
import ScTransaction from '../schema/sc-transaction.mjs';
import userService from './user-service.mjs';

export default {
  /**
   * get all existing users from the DB
   * @returns {*}
   */
  getAllScTransactionOfUser: async userAddress => {
    const scTransactions = await ScTransaction.find({ownerAddress: userAddress});
    if (!scTransactions) errorThrower.noEntryFoundById(userAddress);
    return scTransactions;
  },

  /**
   * Creates a new Smart Contract transaction and pushes it into the users transactions-array
   * @param userAddress
   * @param receiverAddress
   * @param transactionType
   * @param timestamp
   * @param txHash
   * @returns {Promise<*>}
   */
  createScTransaction: async (userAddress, transactionType, timestamp, txHash, additionalInfo) => {
    const scTransaction = new ScTransaction({
      ownerAddress: userAddress,
      transactionType: transactionType,
      timestamp: timestamp,
      txHash: txHash,
      additionalInfo: additionalInfo
    });

    await scTransaction.save();
    let user = await userService.getUserByEthereumAddress(userAddress);
    if (!user) errorThrower.noEntryFoundById('SC Transactions service: ' + userAddress);

    user.scTransactions.push(scTransaction._id);
    await user.save();
    return scTransaction._id;
  }
};
