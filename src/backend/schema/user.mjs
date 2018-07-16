import mongoose from 'mongoose';

/**
 * User of the eureka platform
 * Model is used for the local user authentication with passport
 */
const userSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    email: String
  },
  {collection: 'users'}
);



export default userSchema;
