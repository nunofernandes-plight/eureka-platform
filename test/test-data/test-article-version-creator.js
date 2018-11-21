import mongoose from 'mongoose';
import ArticleVersion from '../../src/backend/schema/article-version.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';

export default {
  createSubmittedArticleVersion1: async () => {
    let articleSubmission = new ArticleVersion({
      ownerAddress: '0xa7F19Ef5E368aB16Cc9ffA1B76C75382d0154F2F',
      document: {'example-var': 'example-value'},
      articleHash: 'exampleHash',
      articleUrl: 'example-url',
      articleVersionState: ArticleVersionState.SUBMITTED,
      articleSubmission: mongoose.Types.ObjectId(),
      editorApprovedReviews: [mongoose.Types.ObjectId()],
      communityReviews:  [mongoose.Types.ObjectId()]
    });
    await articleSubmission.save();
  },
  createSubmittedArticleVersion2: async () => {
    let articleSubmission = new ArticleVersion({
      ownerAddress: '0xdee2b80CAaEDbBe612b331e9994395799a9d2680',
      document: {'example-var': 'example-value'},
      articleHash: 'exampleHash2',
      articleUrl: 'example-url2',
      articleVersionState: ArticleVersionState.SUBMITTED,
      articleSubmission: mongoose.Types.ObjectId(),
      editorApprovedReviews: [mongoose.Types.ObjectId()],
      communityReviews:  [mongoose.Types.ObjectId()]
    });
    await articleSubmission.save();
  },
  createDraftArticleVersion1: async () => {
    let articleSubmission = new ArticleVersion({
      ownerAddress: '0xbB44e39bF87016b167997922597591Bdff68Fd44',
      document: {'example-var': 'example-value'},
      articleHash: 'exampleHash2',
      articleUrl: 'example-url2',
      articleVersionState: ArticleVersionState.DRAFT,
      articleSubmission: mongoose.Types.ObjectId(),
      editorApprovedReviews: [mongoose.Types.ObjectId()],
      communityReviews:  [mongoose.Types.ObjectId()]
    });
    await articleSubmission.save();
  }
};