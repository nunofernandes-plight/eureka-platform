import ArticleSubmission from '../schema/article-submission.mjs';
import userService from './user-service.mjs';

export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({});
  },
  createSubmission: async (submissionId, ownerAddress) => {
    const submission = new ArticleSubmission(
      {_id: submissionId, ownerAddress: ownerAddress});

    await submission.save( (err) => {
      if (err) return console.error(err);
      console.log('Created new ArticleSubmission on DB done');
    });

    await userService.addSubmission(ownerAddress, submissionId);
    return submissionId;
  }
};