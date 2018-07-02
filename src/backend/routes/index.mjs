import express from 'express';
import reviewRoutes from './review-routes.mjs';

const router = express.Router();

//add all different routes here
router.use('/reviews', reviewRoutes);

export default router;
