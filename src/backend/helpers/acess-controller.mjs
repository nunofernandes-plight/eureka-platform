import User from '../schema/user.mjs';
import Roles from '../schema/roles-enum.mjs';

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
      .then(user => {
        if (user.roles.indexOf(Roles.ADMIN) >= 0) next(); // index is -1 if not in the array

        res.status(403).json({
          error: 'Not authorized - not an admin'
        });
      })
      .catch(err => {
        throw err;
      });
  },

  /**
   * Middleware function, which checks if the user has one of the given roles (params)
   * as a role.
   * If he has non he receives a 404 - Not Authorized
   * @param roles as array of string
   * @returns {Function}
   */
  rolesOnly: roles => {
    return function(req, res, next) {
      User.findById(req.user)
        .exec()
        .then(user => {
          let authorized = false;
          if (user.roles.length > 0) {
            for (let i = 0; i < roles.length; i++) {
              if (user.roles.indexOf(roles[i]) >= 0) {
                authorized = true;
              }
            }
            if (authorized) next();
            else {
              res.status(403).json({
                error: 'Not authorized'
              });
            }
          } else {
            res.status(403).json({
              error: 'Not authorized'
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    };
  }
};
