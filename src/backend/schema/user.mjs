import mongoose from 'mongoose';
import Roles from './roles-enum.mjs';

const Schema = mongoose.Schema;

/**
 * User of the eureka platform
 * Model is used for the local user authentication with passport
 */
const userSchema = mongoose.Schema(
  {
    ethereumAddress: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: false
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    isEditor: {
      type: Boolean
    },
    roles: [
      {
        type: String,
        enum: Object.values(Roles)
      }
    ],
    submissions: [
      {
        type: Schema.Types.ObjectId, ref: 'Submission'
      }
    ],
  },
  {collection: 'users'}
);

const User = mongoose.model('User', userSchema, 'users');

export default User;
