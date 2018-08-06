import ArticleSubmission from '../schema/article-submission.mjs';

export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({});
  },
  createSubmission: (ownerAddress) => {
    const submission = new ArticleSubmission({ownerAddress: ownerAddress});
    return submission.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new ArticleSubmission on DB done');
    });
  }
};