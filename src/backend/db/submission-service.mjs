import ArticleSubmission from '../schema/article-submission.mjs';

export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({});
  },
  createSubmission: (ownerAddress, submissionId) => {
    const submission = new ArticleSubmission(
      {_id: submissionId, ownerAddress: ownerAddress});
    return submission.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new ArticleSubmission on DB done');
    });
  }
};