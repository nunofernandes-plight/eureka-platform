import cron from 'cron';
import reviewService from '../db/review-service.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
const CronJob = cron.CronJob;

let cronJob;

export default {
  start: async () => {
    cronJob = await new CronJob('* * * * * *', async () =>  {
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