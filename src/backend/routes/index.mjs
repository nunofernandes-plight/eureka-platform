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
import articleSubmittedRoutes from './article-submitted-routes.mjs';
import articleSubmissionRoutes from './article-submission-routes.mjs';
import addressBook from './address-book-routes.mjs';

const router = express.Router();

//Different backend routes goes here
router.use('/welcome', welcomeRoutes);
router.use('/editorApprovedReviews', reviewRoutes);
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/users', userRoutes);
router.use('/sctransactions', scTransactionRoutes);
router.use('/articles/drafts', articleDraftRoutes);
router.use('/articles/submitted', articleSubmittedRoutes);
router.use('/book', addressBook);


export default router;
