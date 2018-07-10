import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  rating: Number,
  text: String
}, {collection: 'reviews'});

export default reviewSchema;