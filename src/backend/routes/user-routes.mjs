import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import userService from '../db/user-service.mjs';
import accesController from '../controller/acess-controller.mjs';
import Roles from '../schema/roles-enum.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);
router.get(
  '/',
  asyncHandler(async req => {
    if (req.query.email) {
      return await userService.getUsersAddressByEmailQuery(req.query.email);
    }
    if (req.query.ethAddress) {
      const query = req.query.ethAddress;

      if (!Array.isArray(query)) {
        return await userService.getUserByEthereumAddress(query);
      }
      return await Promise.all(
        query.map(async address => {
          return await userService.getUserByEthereumAddress(address);
        })
      );
    }
    errorThrower.noQueryParameterProvided();
  })
);

router.get(
  '/roles',
  asyncHandler(async req => {
    if (req.query.role) {
      if (Roles.hasOwnProperty(req.query.role)) {
        return await userService.getAllUsersByRole(req.query.role);
      }
      return new Error(req.query.role + ' is not a valid role!');
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

router.put(
  '/ownRoles',
  asyncHandler(async req => {
    let role;
    if (!req.body.role) {
      errorThrower.missingBodyValue('role');
    }
    role = req.body.role;
    // restrictions for role updating
    if (role !== Roles.AUTHOR && role !== Roles.REVIEWER) {
      let error = new Error('No authorization to add the role ' + role);
      error.status = 400;
      throw error;
    }
    return await userService.addRole(req.user.ethereumAddress, role);
  })
);

router.delete(
  '/ownRoles',
  asyncHandler(async req => {
    let role;
    if (!req.body.role) {
      errorThrower.missingBodyValue('role');
    }
    role = req.body.role;
    // restrictions for role updating
    if (role !== Roles.AUTHOR && role !== Roles.REVIEWER) {
      let error = new Error('No authorization to add the role ' + role);
      error.status = 400;
      throw error;
    }
    return await userService.removeRole(req.user.ethereumAddress, role);
  })
);

router.get(
  '/scTransactions',
  asyncHandler(async req => {
    return await userService.getOwnScTransactions(req.user.ethereumAddress);
  })
);

router.post(
  '/becomeReviewer',
  asyncHandler(async req => {
    return userService.becomeReviewer(req.body.ethereumAddress);
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
