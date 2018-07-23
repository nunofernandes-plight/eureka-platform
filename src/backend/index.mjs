import app from './api/api.mjs';
import dotenv from 'dotenv';
import mailService from './helpers/mailService';

import isProduction from '../helpers/isProduction.mjs';

//TODO remove her, only testing purpose
mailService.sendMail();

if (!isProduction()) {
  //import env variables from .env file
  dotenv.config();
  app.listen(process.env.PORT || 8080);
}

console.log('App started. Date: ' + new Date().toString());
