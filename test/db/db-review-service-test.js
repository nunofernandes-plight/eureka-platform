import test from 'ava';
import {cleanDB} from '../helpers.js';
import app from '../../src/backend/api/api.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';

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

