import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from '../auth/localPassport'


import router from '../routes/index.mjs';
import userSchema from "../schemas/user";
import mongoose from "../db/mongoose";

//load in env variables
dotenv.config();

/**
 *  Configure the local strategy for use by Passport
 **/
const User = mongoose.model('users', userSchema, 'users');
const app = express();

app.use(session({
  secret: 'eureka secret snippet',
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(bodyParser.json());

app.use('/api', router);

export default app;
