import cron from 'cron';
import reviewService from '../db/review-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import ArticleSubmissionState from '../schema/article-submission-state-enum.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';

const CronJob = cron.CronJob;

const TIME_INTERVAL = 2000;
let cronJob;

export default {
  start: async () => {
    cronJob = await new CronJob('* * * * * *', async () => {
      const timedOutSubmissionIds = await getEditorTimeoutSubmissionIds();

      if(timedOutSubmissionIds.length > 0) {
        // TODO call SC function for each
        for(let timedOutSubmissionId of timedOutSubmissionIds) {
          console.log(timedOutSubmissionId);
        }
      }
      console.log('You will see this message every second');
    }, null, true, 'Europe/Zurich');
  },

  stop: async () => {
    cronJob.stop();
  }
};

/**
 * get all the submission ids from the article-version,
 * where the statetimestamp is too old.
 */
async function getEditorTimeoutSubmissionIds() {
  const submittedArticleVersions = await articleVersionService.getArticleVersionsByState(ArticleVersionState.SUBMITTED);

  let timeoutSubmissionIds = [];

  for (let submittedArticleVersion of submittedArticleVersions) {
    if (timeIsRunnedOut(submittedArticleVersion.stateTimestamp)) {
      timeoutSubmissionIds.push(submittedArticleVersion.articleSubmission);
    }
  }
  return timeoutSubmissionIds;
}

function timeIsRunnedOut(stateTimestamp) {
  return (new Date().getTime() > stateTimestamp + TIME_INTERVAL);
}