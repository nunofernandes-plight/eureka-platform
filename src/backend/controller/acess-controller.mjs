/**
 * Access Controller is handling the authorisation of
 * the different REST routes based on the user id.
 */

import User from '../schema/user.mjs';

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
    res.send({
      'success': false,
      'error': 'Not logged in'
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
              notCorrectRoleError(res, roles);
            }
          } else {
            notCorrectRoleError(res, roles);
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

function notCorrectRoleError(res, roles) {
  res.status = 403;
  res.send({
    'succes': false,
    'error': 'Authorization failed - Access denied for provided role, Roles granted route: ' + roles
  });
}
