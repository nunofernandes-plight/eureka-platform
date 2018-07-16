import app from './api/api.mjs';
import dotenv from 'dotenv';

import isProduction from '../helpers/isProduction.mjs';

if (!isProduction()) {
  //import env variables from .env file
  dotenv.config();
  app.listen(process.env.PORT || 8080);
}

console.log('App started. Date: ' + new Date().toString());
