import bcrypt from 'bcrypt';
import userSchema from "../schemas/user";
import mongoose from "../db/mongoose";

/**
 * Hashes a string , used for the password
 * and compares a given hash with a new inputString
 */
const User = mongoose.model('users', userSchema, 'users');
// rounds of hash, higher => safer, but slower
const saltRounds = 10;

export default {
  hash: (password) => {
    return bcrypt.hash(password, saltRounds).then(function (hash) {
      return hash;
    });
  },
  compare: (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword).then(function (res) {
      return res;
    });
  }
}
