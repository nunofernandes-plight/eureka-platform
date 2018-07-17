import mongoose from 'mongoose';

/**
 * Different roles a platform user can have --> access authorization is based on it.
 */
const roleSchema =  mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ['ADMIN', 'EDITOR', 'REVIEWER', 'GUEST'],
      default: 'GUEST'
    },
  }
);

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
    roles: {
      type: [roleSchema]
    }
  },
  {collection: 'users'}
);




export default userSchema;
