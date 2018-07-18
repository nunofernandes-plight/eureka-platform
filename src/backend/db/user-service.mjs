import mongoose from 'mongoose';
import db from './db';
import bcryptHasher from '../helpers/bcrypt-hasher';
import userSchema from '../schema/user';
import Roles from '../schema/roles-enum';

const COLLECTION = 'users';
const User = mongoose.model('User', userSchema);

export default {
  /**
   * get all existing users from the DB
   * @returns {*}
   */
  getAllUsers: () => {
    return db
      .collection(COLLECTION)
      .find()
      .toArray();
  },
  /**
   * create a new user in the DB
   * @param username
   * @param password
   * @param email
   * @returns {Promise<Model>}
   */
  createUser: async (username, password, email) => {
    const hashedPassword = await bcryptHasher.hash(password);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email
    });

    return newUser.save().then(
      function () {
        return newUser;
      },
      function (err) {
        console.log('Error :' + err);
        throw err;
      }
    );
  },

  /**
   * Add the role to the given user
   * if the role matches a roles-enum
   * @param user_id
   * @param role
   * @returns {Promise<void>}
   */
  addRole: async (user_id, role) => {
    if (Roles.hasOwnProperty(role)) {

      User.findByIdAndUpdate(
        user_id,
        {
          '$addToSet': {
            roles: role
          }
        },
        function (err, user) {
          if (err) throw err;
          console.log('User ' + user_id + ' was granted the role "' + role + '"');
          return user;
        })

    } else {
      throw new Error('No matching role found in DB')
    }
  }
};
