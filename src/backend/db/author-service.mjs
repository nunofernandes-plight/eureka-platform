import mongoose from './mongoose-db';
import db from './db';
import authorSchema from '../schema/author';

const collectionName = 'authors';
const Author = mongoose.model(collectionName, authorSchema, collectionName);

export default {
  getAllAuthors: () => {
    return db
      .collection(collectionName)
      .find()
      .toArray();
  },
  createAuthor: ({ethereumAdress, prename, lastname}) => {
    const author1 = new Author({
      ethereumAddress: ethereumAdress,
      preName: prename,
      lastName: lastname
    });
    return author1.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new author on DB done');
    });
  }
};
