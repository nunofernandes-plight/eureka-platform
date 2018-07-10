import express from 'express';
import reviewRoutes from './review-routes.mjs';
import authorRoutes from './author-routes.mjs';

const router = express.Router();

//add all different routes here
router.use('/reviews', reviewRoutes);
router.use('/authors', authorRoutes);

export default router;
