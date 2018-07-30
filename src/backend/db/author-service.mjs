import db from './db';
import Author from '../schema/author';

export default {
  getAllAuthors: () => {
    return db
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
