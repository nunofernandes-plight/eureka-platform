import db from './db';
import Submission from '../schema/submission';

export default {
  getAllSubmission: () => {
    return db
      .find()
      .toArray();
  },
  createSubmission: (ownerAddress) => {
    const submission = new Submission({ownerAddress: ownerAddress});
    return submission.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new Submission on DB done');
    });
  }
};