/**
 * Testing routes
 */
import express from 'express';
import authenticationCheck from '../controller/acess-controller.mjs';
import Roles from '../schema/roles-enum.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  if(!req.user) {
    let error = new Error('Not logged in Backend');
    error.status= 401;
    throw error;
  }
  return {
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  };
}));

//Test the login through session
router.use(authenticationCheck.rolesOnly([Roles.GUEST]));
router.get('/logged-in', function(req, res) {
  res.send('Welcome in the part for user logged in');
});

export default router;
