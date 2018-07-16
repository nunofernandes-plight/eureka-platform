import mongoose from 'mongoose';

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
    }
  },
  {collection: 'users'}
);


export default userSchema;
