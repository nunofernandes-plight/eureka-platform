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
   * add the role to the given user
   * @param user_id
   * @param role
   * @returns {Promise<*>}
   */


  addRole: async (user_id, role) => {
    if (Roles.hasOwnProperty(role)) {
      console.log('Roles ID works ' + role);
      User.findByIdAndUpdate(
        user_id,
        {'$addToSet': {
          roles: role
          }},
        function (err, user) {
          if(err) throw err;

          return user;
        })

    } else {
      throw new Error('No matching role!')
    }
  }
};
