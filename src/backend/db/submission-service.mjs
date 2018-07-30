import Submission from '../schema/submission.mjs';

export default {
  getAllSubmissions: () => {
    return Submission.find({});
  },
  createSubmission: (ownerAddress) => {
    const submission = new Submission({ownerAddress: ownerAddress});
    return submission.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new Submission on DB done');
    });
  }
};