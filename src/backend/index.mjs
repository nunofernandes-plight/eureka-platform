import app from './api/api';
import isProduction from '../helpers/isProduction';

if (!isProduction()) {
    app.listen(process.env.PORT || 8080);
}

console.log('App started. Date: ' + new Date().toString());
