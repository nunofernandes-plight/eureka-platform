import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import passport from '../helpers/local-passport';
import mongooseDB from '../db/mongoose-db';


import router from '../routes/index.mjs';

//load in env variables
dotenv.config();

const app = express();

/** Session Setup **/
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

//set global variable isAuthenticated -> call ir everywhere dynamically
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next()
});

//Parses the text as JSON and exposes the resulting object on req.body.
app.use(bodyParser.json());

app.use('/api', router);
export default app;
