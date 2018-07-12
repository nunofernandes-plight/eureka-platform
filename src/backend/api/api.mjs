import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';

import router from '../routes/index.mjs';
import passportLocal from "passport-local/lib/index";
import userSchema from "../schemas/user";
import mongoose from "../db/mongoose";

dotenv.config();
const LocalStrategy = passportLocal.Strategy;
/**
 *  Configure the local strategy for use by Passport
 **/
const User = mongoose.model('users', userSchema, 'users');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      // no user found
      if(!user) {
        return done(null, false);
      }

      // incorrect password
      if (user.password != password) {
        return done(null, false);
      }

      //login success
      return done(null, user);
    });
  }
));

/**
 *  Configure Passport authenticated session persistence.
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());


app.post('/', passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
  res.redirect('/success?username='+req.user.username);
  });
// api routes
app.use('/api', router);

//testing
app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

export default app;
