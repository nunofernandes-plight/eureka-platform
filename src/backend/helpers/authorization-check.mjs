import userSchema from '../schema/user';
import Roles from '../schema/roles-enum';
import mongoose from 'mongoose';

const User = mongoose.model('User', userSchema);


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
  adminOnly: (req, res, next) => {
    console.log(req.user);
    User.findById(req.user)
      .exec()
      .then( user => {
        if(user.roles.indexOf(Roles.ADMIN) >= 0) next();

       res.status(403).json({
         error: 'Not authorized - not an admin'
       });
      })
      .catch( err => {
        throw err;
      })

  }
}
