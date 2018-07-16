import db from './db';
import bcryptHasher from '../helpers/bcrypt-hasher';

const COLLECTION = 'users';

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
    console.log(hashedPassword);

    return db.collection(COLLECTION).insert({
      username, // same as : username: username
      password: hashedPassword,
      email
    });
  }
};
