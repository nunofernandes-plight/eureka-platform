import test from 'ava';
import {cleanDB} from '../helpers.js';
import app from '../../src/backend/api/api.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import {
  TEST_INVITATION_ACCEPTED_REVIEW_1,
  TEST_INVITIED_REVIEW_1,
  TEST_INVITIED_REVIEW_2
} from '../test-data/test-reviews.js';

const PRETEXT = 'DB-REVIEW: ';

test.before(async () => {
  await cleanDB();
  // app.setupApp();
  // app.listenTo(process.env.PORT || 8080);
});

test.afterEach(async () => {
  await cleanDB();
});

test.after(async () => {
  //app.close();
});


test(PRETEXT + 'Test', async t => {
  t.is(true, true);
});

test(PRETEXT + 'Connection to reviews in DB', async t => {
  let reviews = await reviewService.getAllReviews();
  t.is(reviews.length, 0);
});

test(PRETEXT + 'Write a review on db, get all reviews', async t => {
  t.is((await reviewService.getAllReviews()).length, 0);
  await TEST_INVITATION_ACCEPTED_REVIEW_1.save();
  t.is((await reviewService.getAllReviews()).length, 1);
});

