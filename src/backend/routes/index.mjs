import express from 'express';
import reviewRoutes from './review-routes.mjs';
import authorRoutes from './author-routes.mjs';

const router = express.Router();

//Different backend routes goes here
router.use('/reviews', reviewRoutes);
router.use('/authors', authorRoutes);

export default router;
