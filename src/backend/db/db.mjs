import mongo from 'then-mongo';

const collections = ['reviews'];
const db = mongo('localhost/eurekaDB', collections);

export default {
  getAllReviews: () => {
    return db
      .collection('reviews')
      .find()
      .toArray();
  },
  //{rating, text} --> rating: body.rating, text: body.text
  insertReview: ({rating, text}) => {
    return db.collection('reviews').insert({
      rating, // rating: rating
      text
    });
  }
};
