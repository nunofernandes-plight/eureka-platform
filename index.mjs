import app from './src/backend/api/api.mjs';
import dotenv from 'dotenv';
import {isProduction} from './src/helpers/isProduction.mjs';
if (!isProduction()) {
  //import env variables from .env file
  dotenv.config();
}
// TODO implement production
app.setupApp();
app.listenTo(process.env.PORT || 8080);
console.log('App started. Date: ' + new Date().toString());
