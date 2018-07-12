import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';


import router from '../routes/index.mjs';
import passportLocal from "passport-local/lib/index";
import userSchema from "../schemas/user";
import mongoose from "../db/mongoose";
import hasher from '../helpers/hasher'

const LocalStrategy = passportLocal.Strategy;

//load in env variables
dotenv.config();

/**
 *  Configure the local strategy for use by Passport
 **/
const User = mongoose.model('users', userSchema, 'users');

passport.use(new LocalStrategy(
   async function (username, password, done) {
     const dbUser = await User.findOne({'username': username});
    const isCorrectHash =  await hasher.compare(password, dbUser.password);

    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      // no user found
      if (!user) {
        return done(null, false);
      }

      // incorrect password
      if (!isCorrectHash) {
        return done(null, false);
      }

      //login success
      return done(null, user);
    });
  })
)
;

/**
 *  Configure Passport authenticated session persistence.
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
});

const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());


app.post('/login', passport.authenticate('local', {failureRedirect: '/error'}),
  function (req, res) {
    res.redirect('/success?username=' + req.user.username);
  });
// api routes
app.post('/signup', async (req, res, next) => {
  console.log(req.body.password);
  let hashedPassword = await hasher.hash(req.body.password);
  console.log('Hash from API: ' + hashedPassword);
  const user = new User({
      "username": req.body.username,
      "password": hashedPassword
  })
  user.save(function (err) {
    if(err) throw err;
    console.log('New User saved on DB')
    return res.send('New User sign up in DB')
  })
});
app.use('/api', router);

//testing
app.get('/success', (req, res) => res.send("Welcome " + req.query.username + "!!"));
app.get('/error', (req, res) => res.send("error logging in"));

export default app;
