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
  {collection: 'contractOwners'}
);

const ContractOwner = mongoose.model('ContractOwner', contractOwnerSchema, 'contractOwners');
export default ContractOwner;