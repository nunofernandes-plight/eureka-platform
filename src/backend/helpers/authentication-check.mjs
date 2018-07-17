/**
 * Authentication check used as a middleware function for a router
 * use it like "router.use(authenticationCheck)
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export default function(req, res, next) {
  if (req.isAuthenticated()) return next();

  //not logged in
  res.status(401);
  res.send('Not logged in');
}
