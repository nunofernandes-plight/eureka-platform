import test from 'ava';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import app from '../../src/backend/api/api.mjs';
import {cleanDB} from '../helpers.js';

const PRETEXT = 'DB-USER: ';

test.before(async () => {
  await cleanDB();
  app.setupApp();
  app.listenTo(process.env.PORT || 8080);
});

test.afterEach(async () => {
  await cleanDB();
});

test.after(async () => {
  app.close();
});

// Test(PRETEXT + 'all collections are empty', async t => {
test(PRETEXT + 'all collections are empty', async t => {
  t.is((await userService.getAllUsers()).length, 0);
  t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
  t.is((await reviewService.getAllReviews()).length, 0);
});

test(PRETEXT + 'create a User', async t => {
  t.is((await userService.getAllUsers()).length, 0);

  const user = await userService.createUser('test', 'test@test@test.ch',
    '0x123f681646d4a755815f9cb19e1acc8565a0c2ac', 'test-avatar');

  t.is((await userService.getAllUsers()).length, 1);

  const dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
  // T.is(dbUser.username, user.username);
  t.is(dbUser.password, user.password);
  t.is(dbUser.email, user.email);
  t.is(dbUser.ethereumAddress, user.ethereumAddress);
});

test(PRETEXT + 'add roles to a user', async t => {
  t.is((await userService.getAllUsers()).length, 0);

  const user = await userService.createUser('test', 'test@test@test.ch',
    '0x123f681646d4a755815f9cb19e1acc8565a0c2ac', 'test-avatar');

  // Test roles
  let dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
  t.is(dbUser.roles.length, 0);
  await userService.addRole(user.ethereumAddress, Roles.REVIEWER);
  dbUser = await userService.getUserById(user._id);
  t.is(dbUser.roles.length, 1);
});

// TODO move it to article-submission-test, as it is not stored anymore within the user object
// Add submission to a user
// test.only(PRETEXT + 'create submission and add it to a user', async t => {
//   // Test user creation
//   t.is((await userService.getAllUsers()).length, 0);
//   let user = await userService.createUser('test', 'test@test@test.ch',
//     '0x123f681646d4a755815f9cb19e1acc8565a0c2ac', 'test-avatar');
//   t.is((await userService.getAllUsers()).length, 1);
//
//   // Test submission creation
//   t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
//   const articleSubmission = await articleSubmissionService.createSubmission(user.ethereumAddress);
//   t.is((await articleSubmissionService.getAllSubmissions()).length, 1);
//
//   // Test adding of submission to user
//   user = await userService.getUserByEthereumAddress(user.ethereumAddress);
//   console.log(user);
//   console.log(articleSubmission);
//   t.is(articleSubmission.submissionId, user.articleSubmissions[0].submissionId);
// });



