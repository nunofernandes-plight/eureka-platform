import test from 'ava';
import User from '../src/backend/schema/user.mjs';
import Submission from '../src/backend/schema/submission.mjs';
import Review from '../src/backend/schema/review.mjs';
import Author from '../src/backend/schema/author.mjs';
import userService from '../src/backend/db/user-service.mjs';
import submissionService from '../src/backend/db/submission-service.mjs';
import authorService from '../src/backend/db/author-service.mjs';
import app from '../src/backend/api/api.mjs';


test.beforeEach(async () => {
  app.setupApp();
  app.listenTo(process.env.PORT || 8080);

  await cleanDB();
});

/**
 * Reset all collections, so they are empty
 * @returns {Promise<void>}
 */
async function cleanDB() {
  await User.remove({});
  await Submission.remove({});
  await Review.remove({});
  await Author.remove({});
}

test('DB: all collections are empty', async t => {
  t.is((await userService.getAllUsers()).length, 0);
  t.is((await submissionService.getAllSubmissions()).length, 0);
  t.is((await authorService.getAllAuthors()).length, 0);
});