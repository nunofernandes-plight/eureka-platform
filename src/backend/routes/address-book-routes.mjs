import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import addressBookService from '../db/address-book-service.mjs';
import accesController from '../controller/acess-controller.mjs';


router.use(accesController.loggedInOnly);
router.get(
  '/',
  asyncHandler(async (req) => {
    return addressBookService.getContacts(req.user.ethereumAddress);
  })
);

router.put(
  '/',
  asyncHandler(async req => {
    return addressBookService.createContact(req.user.ethereumAddress, req.body);
  })
);

router.delete(
  '/',
  asyncHandler(async req => {
    return addressBookService.deleteContact(req.user.ethereumAddress, req.body.contactAddress);
  })
);

export default router;
