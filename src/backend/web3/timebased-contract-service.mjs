import cron from 'cron';
import reviewService from '../db/review-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import ArticleSubmissionState from '../schema/article-submission-state-enum.mjs';
const CronJob = cron.CronJob;

const TIME_INTERVAL = 2000;
let cronJob;

export default {
  start: async () => {
    cronJob = await new CronJob('* * * * * *', async () => {
      //TODO merge with reviews with state 'INVITATION_ACCEPTED'
      let invitedStateReviews = await reviewService.getReviewsByState(ReviewState.INVITED);

      for (let review in invitedStateReviews) {
        console.log('Checking for review with hash: ' + review.reviewHash);
      }

      console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
  },

  stop: async () => {
    cronJob.stop();
  }
};

/**
 * get all the submission ids from the article-submission,
 * where the editor must get removed because he did
 */
// function getEditorTimeoutSubmissionId() {
//   const editorAssignedSubmissions = articleSubmissionService.getArticleSubmissionsByState(ArticleSubmissionState.EDITOR_ASSIGNED);
//
//   let timeoutSubmissionIds = [];
//
//   for (let editorAssignedSubmission of editorAssignedSubmissions) {
//     if (timeIsRunnedOut(editorAssignedSubmission.stateTimestamp)) {
//       timeoutSubmissionIds.push(editorAssignedSubmission.scSubmissionID);
//     }
//   }
//   return timeoutSubmissionIds;
// }
//
// function timeIsRunnedOut(stateTimestamp) {
//   return Date.now() > stateTimestamp + TIME_INTERVAL;
// }