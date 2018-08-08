import passport from 'passport';
import passportLocal from 'passport-local/lib/index';
import bcryptHasher from './bcrypt-hasher.mjs';
import User from '../schema/user.mjs';

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'ethereumAddress',
      passwordField: 'password'
    },

    async function(ethereumAddress, password, done) {

      // user in db?
      const dbUser = await User.findOne({ethereumAddress: ethereumAddress});
      if(!dbUser) {
        let error = new Error('Provided Login credentials are wrong 1');
        error.status = 401;
        return done(null, false);
      }

      // correct pwd?
      const isCorrectHash = await bcryptHasher.compare(password, dbUser.password);
      if(!isCorrectHash) {
        let error = new Error('Provided Login credentials are wrong 2');
        error.status = 401;
        return done(null, false);
      }

      //login success
      return done(null, dbUser);
    })
);

/**
 *  Configure Passport authenticated session persistence.
 */
passport.serializeUser(function(ethereumAddress, done) {
  done(null, ethereumAddress);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport;
