import db from './db';

export default {
  getAllReviews: () => {
    return db
      .collection('reviews')
      .find()
      .toArray();
  },
  //{rating, text} --> rating: body.rating, text: body.text
  createReview: ({rating, text}) => {
    return db.collection('reviews').insert({
      rating, // rating: rating
      text
    });
  }
};
