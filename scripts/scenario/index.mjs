import {createDifferentUsers} from './createDifferentUsers.mjs';
import app from '../../src/backend/api/api.mjs';
import User from '../../src/backend/schema/user.mjs';
import ArticleSubmission from '../../src/backend/schema/article-submission.mjs';
import Review from '../../src/backend/schema/review.mjs';
import ArticleVersion from '../../src/backend/schema/article-version.mjs';
import ScTransactions from '../../src/backend/schema/sc-transaction.mjs';

const cleanCollections = async () => {
  await User.remove({});
  await ArticleSubmission.remove({});
  await Review.remove({});
  await ArticleVersion.remove({});
  await ScTransactions.remove({});
  await ScTransactions.remove({});
};
const start = async () => {
  await cleanCollections();
  await app.setupApp();
  await createDifferentUsers();
};

start();
