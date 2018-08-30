import mongoose from 'mongoose';

const addressBookSchema = mongoose.Schema(
  {
    addressBookOwnerAddress: {
      type: String,
      required: true
    },
    contactAddress: {
      type: String,
      required: true
    },
    preName: String,
    lastName: String,
    info: String
  },
  {collection: 'addressBook'}
);
const AddressBook = mongoose.model('AddressBook', addressBookSchema, 'addressBook');
export default AddressBook;
