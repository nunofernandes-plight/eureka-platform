
// let authenticationMiddleware = function (req, res, next) {
//     console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
//
//     if (req.isAuthenticated()) return next();
//     res.redirect('api/login')
// };

//export default authenticationMiddleware();

export default function (req, res, next) {
  console.log('Hello from external middleware');

  if(req.isAuthenticated()) return next();
  res.send('Not logged in');
}