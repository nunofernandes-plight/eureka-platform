import test from 'ava';
import {cleanDB} from '../helpers.js';
import articleVersionService from '../../src/backend/db/article-version-service.mjs';
import testArticleVersionCreator from '../test-data/test-article-version-creator.js';
import app from '../../src/backend/api/api.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';


const PRETEXT = 'DB-ARTICLE-VERSIONS: ';

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

test(PRETEXT + 'Connection to article versions in DB', async t => {
  let articleVersions = await articleVersionService.getAllArticleVersions();
  t.is(articleVersions.length, 0);
});

test(PRETEXT + 'Get all articleVersion by their state', async t => {
  t.is((await articleVersionService.getAllArticleVersions()).length, 0);

  await testArticleVersionCreator.createSubmittedArticleVersion1();
  await testArticleVersionCreator.createSubmittedArticleVersion2();
  await testArticleVersionCreator.createDraftArticleVersion1();
  t.is((await articleVersionService.getAllArticleVersions()).length, 3);
  t.is((await articleVersionService.getArticleVersionsByState(ArticleVersionState.SUBMITTED)).length, 2);
  t.is((await articleVersionService.getArticleVersionsByState(ArticleVersionState.DRAFT)).length, 1);
  t.is((await articleVersionService.getArticleVersionsByState(ArticleVersionState.OPEN_FOR_ALL_REVIEWERS)).length, 0);
});

