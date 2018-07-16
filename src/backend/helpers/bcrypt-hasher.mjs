import bcrypt from 'bcrypt';

/**
 * Hashes a string , used for the password
 * and compares a given hash with a new inputString
 * Methods return a promise --> use async - await
 */
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