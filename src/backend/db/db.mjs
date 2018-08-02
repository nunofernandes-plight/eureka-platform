import dotenv from 'dotenv';
import {isProduction, isTest} from '../../helpers/isProduction.mjs';
import mongo from 'then-mongo/index';

const collections = ['reviews'];

if (!isProduction() && !isTest()) {
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

if (isProduction() || isTest()) {
  url = url.concat('?ssl=true');
}

const db = mongo(url, collections);

export default db;
