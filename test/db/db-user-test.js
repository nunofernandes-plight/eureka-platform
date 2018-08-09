import test from 'ava';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import authorService from '../../src/backend/db/author-service.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import app from '../../src/backend/api/api.mjs';
import {cleanDB} from '.././helpers';

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

//test(PRETEXT + 'all collections are empty', async t => {
test(PRETEXT + 'all collections are empty', async t => {
  t.is((await userService.getAllUsers()).length, 0);
  t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
  t.is((await authorService.getAllAuthors()).length, 0);
  t.is((await reviewService.getAllReviews()).length, 0);
});

test(PRETEXT + 'create a User', async t => {
  t.is((await userService.getAllUsers()).length, 0);

  const user = await userService.createUser('test', 'test@test@test.ch',
    '0x123f681646d4a755815f9cb19e1acc8565a0c2ac');

  t.is((await userService.getAllUsers()).length, 1);

  const dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
  // t.is(dbUser.username, user.username);
  t.is(dbUser.password, user.password);
  t.is(dbUser.email, user.email);
  t.is(dbUser.ethereumAddress, user.ethereumAddress);
});

test(PRETEXT + 'add roles to a user', async t => {
  t.is((await userService.getAllUsers()).length, 0);

  const user = await userService.createUser('test', 'test@test@test.ch',
    '0x123f681646d4a755815f9cb19e1acc8565a0c2ac');

  //test roles
  let dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
  t.is(dbUser.roles.length, 0);

  await userService.addRole(user._id, Roles.GUEST);
  dbUser = await userService.getUserById(user._id);
  t.is(dbUser.roles.length, 1);
});

//add submission to a user
test(PRETEXT + 'create submission and add it to a user', async t => {
  //test user creation
  t.is((await userService.getAllUsers()).length, 0);
  let user = await userService.createUser('test', 'test@test@test.ch',
    '0x123f681646d4a755815f9cb19e1acc8565a0c2ac');
  t.is((await userService.getAllUsers()).length, 1);

  //test submission creation
  t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
  const articleSubmission = await articleSubmissionService.createSubmission(0, user.ethereumAddress);
  t.is((await articleSubmissionService.getAllSubmissions()).length, 1);

  //test adding of submission to user
  user = await userService.getUserByEthereumAddress(user.ethereumAddress);
  t.is(articleSubmission.submissionId, user.articleSubmissions[0].submissionId);
});
// TODO removeRole
