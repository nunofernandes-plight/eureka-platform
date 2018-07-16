import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from '../helpers/local-passport';
import mongooseDB from '../db/mongoose-db';
import connectMongo from 'connect-mongo';


import router from '../routes/index.mjs';

//load in env variables
dotenv.config();

const app = express();

/** Session Setup **/
const MongoStore = connectMongo(session);
app.use(
  session({
    secret: 'eureka secret snippet', //TODO change to random generated string?
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

//already in /helpers/local-passport
// passport.serializeUser(function (_id, done) {
//   done(null, _id);
// });
//
// passport.deserializeUser(function (_id, done) {
//   User.findById(_id, function (err, user) {
//     done(err, user);
//   });
// });

app.use(passport.session());


/** Parser **/
//Parses the text as URL encoded data
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//Parses the text as JSON and exposes the resulting object on req.body.
app.use(bodyParser.json());


app.use('/api', router);
export default app;
