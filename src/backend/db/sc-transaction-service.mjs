import errorThrower from '../helpers/error-thrower.mjs';
import ScTransaction from '../schema/sc-transaction.mjs';
import userService from './user-service.mjs';
import User from '../schema/user.mjs';


export default {
  /**
   * get all existing users from the DB
   * @returns {*}
   */
  getAllScTransactionOfUser: async userAddress => {
    const scTransactions = await ScTransaction.find({ownerAddress: userAddress});
    if(!scTransactions) errorThrower.noEntryFoundById(userAddress);
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
  createScTransaction: async (userAddress, receiverAddress, transactionType, timestamp, txHash) => {
    const scTransaction = new ScTransaction({
      ownerAddress: userAddress,
      receiverAddress: receiverAddress,
      transactionType: transactionType,
      timestamp: timestamp,
      txHash: txHash
    });

    await scTransaction.save();
    let user = await User.findOne({
      ethereumAddress: userAddress,
    });
    if(!user) errorThrower.noEntryFoundById('SC Transactions service: ' + userAddress);
    user.scTransactions.push(scTransaction._id);
    await user.save();
    return scTransaction._id;
  }
};
