import mongoose from 'mongoose';
import Roles from './roles-enum.mjs';

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
    avatar: {
      type: String,
      required: true,
      unique: false
    },
    roles: [
      {
        type: String,
        enum: Object.values(Roles)
      }
    ],
    scTransactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScTransaction'
    }]
  },
  {collection: 'users'}
);

const User = mongoose.model('User', userSchema, 'users');

export default User;
