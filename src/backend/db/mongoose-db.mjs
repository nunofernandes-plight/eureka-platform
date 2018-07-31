import mongoose from 'mongoose';
import {isProduction, isTest} from '../../helpers/isProduction.mjs';
import dotenv from 'dotenv';

if (!isProduction() && (!isTest())) {
  dotenv.config();
}

let url =
  'mongodb://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASSWORD +
  '@' +
  process.env.DB_HOST +
  '/' +
  process.env.DB_NAME;

if(isProduction() || isTest()) {
  url = url.concat('?ssl=true');
}

console.log(url);
mongoose.connect(url);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB with Mongoose');
});

export default mongoose;
