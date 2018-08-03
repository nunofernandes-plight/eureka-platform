import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import passport from '../helpers/local-passport.mjs';
import mongooseDB from '../db/mongoose-db.mjs';
import {isProduction} from '../../helpers/isProduction.mjs';
import router from '../routes/index.mjs';
import contractEventListener from '../helpers/contract-event-handler.mjs';

if (!isProduction) {
  dotenv.config();
}

let app;
let server;

export default {
  setupApp: eurekaPlatformContract => {
    app = express();



    const MongoStore = connectMongo(session);
    app.use(
      session({
        secret: 'eureka secret snippet', //TODO change to env variable
        //secret: process.env.DB_USER,
        resave: false,
        //stores session into DB
        store: new MongoStore({
          mongooseConnection: mongooseDB.connection
        }),
        saveUninitialized: true,
        name: 'eureka.sid'
        //cookie: { secure: true }
      })
    );

    /** Passport setup **/
    app.use(passport.initialize());
    app.use(passport.session());

    /** Parser **/
    //Parses the text as URL encoded data
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

      app.use(cors());
    /** SC Events Listener **/
    // if(!isProduction()) { swap to that
    if (eurekaPlatformContract) {
      contractEventListener.setup(eurekaPlatformContract);
    } else {
      // TODO setup with constant public address
    }

    //set global variable isAuthenticated -> call ir everywhere dynamically
    app.use(function(req, res, next) {
      res.locals.isAuthenticated = req.isAuthenticated();
      next();
    });

    //Parses the text as JSON and exposes the resulting object on req.body.
    app.use(bodyParser.json());

    app.use('/api', router);
  },

  listenTo: port => {
    server = app.listen(port || 8080);
  },

  close: () => {
    server.close();
  }
};
