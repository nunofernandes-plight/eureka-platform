import mongoose from 'mongoose';
/**
 * ContractOwnerSchema used to check for the contractOwner.
 * There is only one contractOwner object with _id = 1 in the DB.
 */
export const contractOwnerSchema = mongoose.Schema(
  {
    _id: Number,
    address: {
      type: String,
      required: true
    }
  },
  {collection: 'contractOwner'}
);

const ContractOwner = mongoose.model('ContractOwners', contractOwnerSchema, 'contractOwners');
export default ContractOwner;