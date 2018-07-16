import mongoose from 'mongoose'
import db from './db';
import bcryptHasher from '../helpers/bcrypt-hasher';
import userSchema from '../schema/user';

const COLLECTION = 'users';
const User = mongoose.model('User', userSchema);

export default {
  getAllUsers: () => {
    return db
      .collection(COLLECTION)
      .find()
      .toArray();
  },
  //{rating, text} --> rating: body.rating, text: body.text
  createUser: async (username, password, email) => {
    const hashedPassword = await bcryptHasher.hash(password);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email
    });

    newUser.save(function (err, newUser) {
      if (err) throw  err;
      console.log('New DB User: ' + newUser);
    });
  }
};
