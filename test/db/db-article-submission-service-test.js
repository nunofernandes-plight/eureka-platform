import test from 'ava';
import {cleanDB} from '../helpers.js';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import testArticleSubmissionCreator from '../test-data/test-article-submission-creator.js';
import app from '../../src/backend/api/api.mjs';
import ArticleSubmissionState from '../../src/backend/schema/article-submission-state-enum.mjs';


const PRETEXT = 'DB-ARTICLE-SUBMISSIONS: ';

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
  let articleSubmissions = await articleSubmissionService.getAllSubmissions();
  t.is(articleSubmissions.length, 0);
});

test(PRETEXT + 'Get all articleSubmissions by their state', async t => {
  t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
  await testArticleSubmissionCreator.createEditorAssignedArticleSubmission1();
  await testArticleSubmissionCreator.createEditorAssignedArticleSubmission2();

  await testArticleSubmissionCreator.createOpenArticleSubmission1();

  t.is((await articleSubmissionService.getArticleSubmissionsByState(ArticleSubmissionState.EDITOR_ASSIGNED)).length, 2);
  t.is((await articleSubmissionService.getArticleSubmissionsByState(ArticleSubmissionState.OPEN)).length, 1);
  t.is((await articleSubmissionService.getArticleSubmissionsByState(ArticleSubmissionState.CLOSED)).length, 0);
});



