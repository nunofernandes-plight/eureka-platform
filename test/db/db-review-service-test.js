import test from 'ava';
import {cleanDB} from '../helpers.js';
import app from '../../src/backend/api/api.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import testReviewCreator from '../test-data/test-reviews.js';
import ReviewState from '../../src/backend/schema/review-state-enum.mjs';

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
  await testReviewCreator.createInvitedReview1();
  t.is((await reviewService.getAllReviews()).length, 1);
});

test(PRETEXT + 'Get all reviews by their state', async t => {
  t.is((await reviewService.getAllReviews()).length, 0);

  //await TEST_INVITIED_REVIEW_1.save();
  await testReviewCreator.createInvitedReview1();
  await testReviewCreator.createInvitedReview2();
  await testReviewCreator.createAcceptedReview1();

  t.is((await reviewService.getReviewsByState(ReviewState.INVITED)).length, 2);
  t.is((await reviewService.getReviewsByState(ReviewState.ACCEPTED)).length, 1);

});
