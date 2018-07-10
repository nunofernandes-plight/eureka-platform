import mongoose from 'mongoose';

/**
 * User of the eureka platform
 * Schema is used for the local user authentication with passport
 */
const userSchema = mongoose.Schema({
  username: String,
  password: String,
}, {collection: 'users'});

export default userSchema;