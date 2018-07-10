import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
const router = express.Router();
import authorService from '../db-services/author-service';

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