import express from 'express';
import reviewRoutes from './review-routes.mjs';
import welcomeRoutes from './welcome-routes.mjs';
import authorRoutes from './author-routes.mjs';
import signupRoutes from './register-routes.mjs';
import loginRoutes from './login-routes';
import logoutRoutes from './logout-routes';
import registerRoutes from './register-routes';

const router = express.Router();

//Different backend routes goes here
router.use('/welcome', welcomeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/authors', authorRoutes);
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);

export default router;
