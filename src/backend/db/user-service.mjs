import mongoose from 'mongoose';
import db from './db';
import bcryptHasher from '../helpers/bcrypt-hasher';
import userSchema from '../schema/user';
import roleSchema from '../schema/role';

const COLLECTION = 'users';
const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);

export default {
  getAllUsers: () => {
    return db
      .collection(COLLECTION)
      .find()
      .toArray();
  },
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

  addRole: async (user_id, role) => {

    const newRole = new Role({
      value: role
    });

    const validationError = newRole.validateSync();
    if(validationError) {
      throw validationError;
    }

    // add to set if not there yet
    return User.findByIdAndUpdate( user_id ,
      {'$addToSet': {
        'roles': newRole
        }},
      function (err, user) {
        if(err) return err;
        return user;
      }
      );
  }
};
