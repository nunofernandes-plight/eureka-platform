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
import contractEventListener from '../controller/contract-event-controller.mjs';
import uploadRouter from '../routes/file-upload.routes.mjs';

if (!isProduction) {
  dotenv.config();
}

let app;
let server;

export default {
  setupApp: eurekaPlatformContract => {
    app = express();

    /** Parser **/
    //Parses the text as URL encoded data
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

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
        saveUninitialized: false,
        name: 'eureka.sid',
        cookie: {maxAge: 24 * 3600000, secure: false, httpOnly: false}
      })
    );

    app.use(cors({credentials: true, origin: ['http://localhost:3000']}));

    /** Passport setup **/
    app.use(passport.initialize());
    app.use(passport.session());

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
    app.get('/fileupload', uploadRouter);
  },

  listenTo: port => {
    server = app.listen(port || 8080);
  },

  close: () => {
    server.close();
  }
};
