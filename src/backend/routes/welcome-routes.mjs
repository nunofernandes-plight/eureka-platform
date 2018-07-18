/**
 * Testing routes
 */
import express from 'express';
import authenticationCheck from '../helpers/acess-controller';
const router = express.Router();

router.get('/', function(req, res) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.send(
    'Welcome to EUREKA! REQ_USER: ' +
      req.user +
      ' AUTHENTICATED: ' +
      req.isAuthenticated()
  );
});

//Test the login through session
router.use(authenticationCheck.rolesOnly(['GUEST']));
router.get('/logged-in', function(req, res) {
  res.send('Welcome in the part for user logged in');
});

export default router;
