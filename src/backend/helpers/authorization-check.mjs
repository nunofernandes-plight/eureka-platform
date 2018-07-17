import userSchema from '../schema/user';
import roleSchema from '../schema/roles-enum';
import mongoose from 'mongoose';

const User = mongoose.model('User', userSchema);
//const Role = mongoose.model('Role', roleSchema);

//const adminRole = new Role({value: 'ADMIN' });

export default {
  /**
   * Logged-in check used as a middleware function for a router
   * use it like "router.use(authorizationCheck.loggedInOnly)
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  loggedInOnly: (req, res, next) => {
    if (req.isAuthenticated()) return next();

    //not logged in
    res.status(401);
    res.send('Not logged in');
  },
}
