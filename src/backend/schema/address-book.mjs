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
    label: Array,
  },
  {collection: 'addressBook'}
);
const Contact = mongoose.model('Contact', addressBookSchema, 'addressBook');
export default Contact;
