import app from './api/api.mjs';
import dotenv from 'dotenv';
import {isProduction} from '../helpers/isProduction.mjs';

if (!isProduction()) {
  //import env variables from .env file
  dotenv.config();
}
// TODO implement production
app.setupApp();
app.listenTo(process.env.PORT || 8080);

console.log('App started. Date: ' + new Date().toString());
