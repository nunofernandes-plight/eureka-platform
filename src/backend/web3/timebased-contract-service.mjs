import cron from 'cron';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import ArticleSubmissionState from '../schema/article-submission-state-enum.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import {removeEditorFromSubmissionProcess} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';

const CronJob = cron.CronJob;
const TIME_OUT_INTERVAL = 50; //timeout interval in seconds //TODO change to dropout time interval
const CRONE_TIME_INTERVAL = '*/12 * * * * *'; // all 5 seconds // TODO change to real cronjob interval

let cronJob;

export default {
  start: async (_platformContract, _contractOwnerAddress) => {
    cronJob = await new CronJob(CRONE_TIME_INTERVAL, async () => {
      const timedOutSubmissionIds = await getEditorTimeoutSubmissionIds();

      if(timedOutSubmissionIds.length > 0) {

        for(let timedOutSubmissionId of timedOutSubmissionIds) {
          try{
            await removeEditorFromSubmissionProcess(
              _platformContract,
              timedOutSubmissionId
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
 * First get all the submission ids from the article-version,
 * where the state is 'SUBMITTED' and the articleVersion State is 'EDITOR_ASSIGNED'.
 * Secondly, it checks if the time for the Editor to do the health-check is ran out.
 * If that is the case the submissionId of the corresponding Articlesubmission gets saved
 * and eventually returned with all other submissionIds.
 */
async function getEditorTimeoutSubmissionIds() {
  const submittedArticleVersions = await articleVersionService.getArticleVersionsByState(ArticleVersionState.SUBMITTED);
  let potentialTimedOutVersions = [];

  for(let submittedArticleVersion of submittedArticleVersions) {
    const correspondingArticleSubmission =
      await articleSubmissionService.getSubmissionById(submittedArticleVersion.articleSubmission);
    if(correspondingArticleSubmission.articleSubmissionState === ArticleSubmissionState.EDITOR_ASSIGNED) {
      potentialTimedOutVersions.push({articleVersion: submittedArticleVersion, submissionTimestamp: correspondingArticleSubmission.stateTimestamp, scSubmissionID: correspondingArticleSubmission.scSubmissionID});
    }
  }

  let timeoutSubmissionIds = [];

  let differences = [];
  let scIDs = [];

  for (let potentialTimedOutVersion of potentialTimedOutVersions) {
    const now = Math.round(new Date().getTime()/1000);
    const timestamp = potentialTimedOutVersion.submissionTimestamp;

    // only testing TODO remove
    scIDs.push(potentialTimedOutVersion.scSubmissionID);
    differences.push(now - timestamp);

    if((now - TIME_OUT_INTERVAL - timestamp) > 0) {
      //sconsole.log(potentialTimedOutVersion);
      timeoutSubmissionIds.push(potentialTimedOutVersion.scSubmissionID);
    }
  }


  // only testing TODO remove
  console.log('SCSubmissionIds: ');
  console.log(scIDs);
  console.log('Differences: ');
  console.log(differences);

  return timeoutSubmissionIds;
}