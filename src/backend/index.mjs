import app from './api/api.mjs';
import isProduction from '../helpers/isProduction.mjs';

if (!isProduction()) {
  app.listen(process.env.PORT || 8080);
}

console.log('App started. Date: ' + new Date().toString());
