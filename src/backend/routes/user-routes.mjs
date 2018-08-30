import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import userService from '../db/user-service.mjs';
import accesController from '../controller/acess-controller.mjs';
import Roles from '../schema/roles-enum.mjs';
import queryString from 'query-string';

const router = express.Router();

router.use(accesController.loggedInOnly);
router.get(
  '/',
  asyncHandler(async req => {
    if (req.query.email) {
      return await userService.getUsersAddressByEmailQuery(req.query.email);
    }
    if (req.query.ethAddress) {
      const addresses = req.query.ethAddress;
      const users = [];
      return await Promise.all(
        addresses.map(async address => {
          return await userService.getUserByEthereumAddress(address);
        })
      );
    }
    errorThrower.noQueryParameterProvided();
  })
);

router.get(
  '/data',
  asyncHandler(async req => {
    let user = await userService.getUserByEthereumAddress(
      req.user.ethereumAddress
    );
    user.password = undefined;
    return {
      user: user,
      isAuthenticated: req.isAuthenticated()
    };
  })
);

router.get(
  '/ownRoles',
  asyncHandler(async req => {
    return await userService.getOwnRoles(req.user.ethereumAddress);
  })
);

router.use(accesController.rolesOnly(Roles.ADMIN));

router.post(
  '/addRole',
  asyncHandler(async req => {
    return userService.addRole(req.body.user_id, req.body.role);
  })
);

export default router;
