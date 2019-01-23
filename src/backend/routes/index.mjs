import express from 'express';
import reviewRoutes from './review-routes.mjs';
import welcomeRoutes from './welcome-routes.mjs';
import signupRoutes from './register-routes.mjs';
import loginRoutes from './login-routes.mjs';
import logoutRoutes from './logout-routes.mjs';
import registerRoutes from './register-routes.mjs';
import userRoutes from './user-routes.mjs';
import scTransactionRoutes from './sc-transaction-routes.mjs';
import articleDraftRoutes from './article-draft-routes.mjs';
import articleVersionRoutes from './article-version-routes.mjs';
import articleSubmissionRoutes from './article-submission-routes.mjs';
import addressBook from './address-book-routes.mjs';
import annotationRoutes from './annotation-routes.mjs';
import frontendTransactionRoutes from './frontend-transaction-routes.mjs';
import dashboardRoutes from './dashboard-routes.mjs';

const router = express.Router();

//Backen routes
router.use('/welcome', welcomeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/users', userRoutes);
router.use('/sctransactions', scTransactionRoutes);
router.use('/frontendtransactions', frontendTransactionRoutes);
router.use('/submissions', articleSubmissionRoutes);
router.use('/articles/drafts', articleDraftRoutes);
router.use('/articles', articleVersionRoutes);
router.use('/book', addressBook);
router.use('/annotations', annotationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
