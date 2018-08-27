/**
 * Helper functions for testing purposes
 */
import test from 'ava';
import User from '../src/backend/schema/user.mjs';
import ArticleSubmission from '../src/backend/schema/article-submission.mjs';
import Review from '../src/backend/schema/review.mjs';
import Author from '../src/backend/schema/author.mjs';

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

/**
 * Used for sleeping befor e.g. testing
 * @param milliseconds
 */
export function sleepSync(milliseconds) {
	const start = new Date().getTime();
	for (let i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

test('foo', t => {
	t.pass();
});
