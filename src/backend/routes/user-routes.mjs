import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
const router = express.Router();
import userService from '../db/user-service.mjs';
import accesController from '../controller/acess-controller.mjs';
import Roles from '../schema/roles-enum.mjs';

router.use(accesController.loggedInOnly);

router.get(
  '/data',
  asyncHandler(async (req, res) => {
    if(!req.user) {
      errorThrower.notLoggedIn();
    }

    const requesterAddress = req.session.passport.user.ethereumAddress;
    if(requesterAddress !== req.user.ethereumAddress) {
      errorThrower.notCorrectEthereumAddress();
    }
    return await userService.getUserByEthereumAddress(req.user.ethereumAddress);
  })
);

router.use(accesController.rolesOnly(Roles.ADMIN));

router.post(
  '/addRole',
  asyncHandler(async req => {
    return userService.addRole(req.body.user_id, req.body.role);
  })
);

router.post(
  '/makeEditor',
  asyncHandler(async req => {
    return userService.makeEditor(req.body.user_id);
  })
);

router.get(
  '/',
  asyncHandler(async () => {
    return userService.getAllUsers();
  })
);

export default router;
