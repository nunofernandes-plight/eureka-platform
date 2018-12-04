import cron from 'cron';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import ArticleSubmissionState from '../schema/article-submission-state-enum.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import {removeEditorFromSubmissionProcess} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';

const CronJob = cron.CronJob;
const TIME_OUT_INTERVAL = 10; //TODO change to dropout time intervall
const CRONE_TIME_INTERVAL = '*/5 * * * * *';

let cronJob;

export default {
  start: async (_platformContract, _contractOwnerAddress) => {
    cronJob = await new CronJob(CRONE_TIME_INTERVAL, async () => {
      const timedOutSubmissionIds = await getEditorTimeoutSubmissionIds();

      if(timedOutSubmissionIds.length > 0) {

        for(let timedOutSubmissionId of timedOutSubmissionIds) {

          let timedOutSubmission = await articleSubmissionService.getSubmissionById(timedOutSubmissionId);
          try{
            await removeEditorFromSubmissionProcess(
              _platformContract,
              timedOutSubmission.scSubmissionID
            ).send({
              from: _contractOwnerAddress
            });
          } catch (e) {
            console.warn('Removing is already done, ERROR-MESSAGE: ' + e);
          }
        }
      }
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
  let potentialTimedOutVersions = [];

  for(let submittedArticleVersion of submittedArticleVersions) {
    const correspondingArticleSubmission =
      await articleSubmissionService.getSubmissionById(submittedArticleVersion.articleSubmission);
    if(correspondingArticleSubmission.articleSubmissionState === ArticleSubmissionState.EDITOR_ASSIGNED) {
      potentialTimedOutVersions.push(submittedArticleVersion);
    }
  }

  let timeoutSubmissionIds = [];

  for (let potentialTimedOutVersion of potentialTimedOutVersions) {
    if (timeIsRunnedOut(potentialTimedOutVersion.stateTimestamp)) {
      timeoutSubmissionIds.push(potentialTimedOutVersion.articleSubmission);
    }
  }

  return timeoutSubmissionIds;
}

function timeIsRunnedOut(stateTimestamp) {
  return (new Date().getTime() > stateTimestamp + TIME_OUT_INTERVAL);
}