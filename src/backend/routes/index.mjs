import express from 'express';
import reviewRoutes from './review-routes.mjs';
import authorRoutes from './author-routes.mjs';
import signupRoutes from './sign-up-routes.mjs';
import loginRoutes from './login-routes';

const router = express.Router();

//Different backend routes goes here
router.use('/reviews', reviewRoutes);
router.use('/authors', authorRoutes);
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);


export default router;
