import mongoose from 'mongoose';

const authorSchema = mongoose.Schema(
  {
    ethereumAddress: String,
    preName: String,
    lastName: String
  },
  {collection: 'authors'}
);

export default authorSchema;
