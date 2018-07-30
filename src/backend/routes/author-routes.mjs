import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import authorService from '../db/author-service.mjs';

router.get(
  '/',
  asyncHandler(async () => {
    return authorService.getAllAuthors();
  })
);

router.post(
  '/',
  asyncHandler(async req => {
    return authorService.createAuthor(req.body);
  })
);

export default router;
