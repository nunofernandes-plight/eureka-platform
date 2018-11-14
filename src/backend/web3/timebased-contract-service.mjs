import cron from 'cron';

const CronJob = cron.CronJob;

export default {
  startTimeBasedSCWorker: async () => {
    new CronJob('* * * * * *', function() {
      console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
  }
};
