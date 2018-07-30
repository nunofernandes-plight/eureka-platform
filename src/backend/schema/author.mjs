import mongoose from 'mongoose';

const authorSchema = mongoose.Schema(
  {
    ethereumAddress: String,
    preName: String,
    lastName: String
  },
  {collection: 'authors'}
);
const Author = mongoose.model('Author', authorSchema, 'authors');
export default Author;
