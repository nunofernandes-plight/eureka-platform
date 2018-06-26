import mongo from 'then-mongo';
const collections = ['reviews'];

export default class {
  constructor(dbUrl) {
    this.db = mongo(dbUrl, collections);
  }
  
  getAllReviews() {
     return this.db.collection('reviews').find().toArray();
  }

  insertReview(rating, text) {
    return this.db.collection('reviews').insert(
      {
        rating: rating,
        text: text
      }
    )
  }
}