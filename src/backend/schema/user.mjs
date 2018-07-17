import mongoose from 'mongoose';

import roleSchema from './role';
/**
 * User of the eureka platform
 * Model is used for the local user authentication with passport
 */
const userSchema = mongoose.Schema(
  {
    username: {
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
    roles: [roleSchema]
  },
  {collection: 'users'}
);




export default userSchema;
