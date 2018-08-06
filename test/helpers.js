/**
 * Helper functions for testing purposes
 */
import User from '../src/backend/schema/user.mjs';
import ArticleSubmission from '../src/backend/schema/article-submission.mjs';
import Review from '../src/backend/schema/review.mjs';
import Author from '../src/backend/schema/author.mjs';
import test from 'ava';

/**
 * Empties all the collections of the DB
 * @returns {Promise<void>}
 */
export async function cleanDB() {
  await User.remove({});
  await ArticleSubmission.remove({});
  await Review.remove({});
  await Author.remove({});
}

test('foo', t => {
  t.pass();
});