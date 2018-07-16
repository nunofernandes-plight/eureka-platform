export default function (req, res, next) {
  if(req.isAuthenticated()) return next();

  //not logged in
  res.status(401);
  res.send('Not logged in');
}