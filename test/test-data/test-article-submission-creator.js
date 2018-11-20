import mongoose from 'mongoose';
import ArticleSubmission from '../../src/backend/schema/article-submission.mjs';
import ArticleSubmissionState from '../../src/backend/schema/article-submission-state-enum.mjs'

export default {
  createEditorAssignedArticleSubmission1: async () => {
    let articleSubmission = new ArticleSubmission({
      ownerAddress: '0xa7F19Ef5E368aB16Cc9ffA1B76C75382d0154F2F',
      scSubmissionID: 0,
      stateTimestamp: new Date().getTime() - 200000, // 200 seconds before now
      articleSubmissionState: ArticleSubmissionState.EDITOR_ASSIGNED,
      editor: 'Tet editor',
      articleVersions: mongoose.Types.ObjectId(),

    });
    await articleSubmission.save();
  },
  createEditorAssignedArticleSubmission2: async () => {
    let articleSubmission = new ArticleSubmission({
      ownerAddress: '0xA8Dd80d44959490bcAAdc41d916A9D8a5d0038CC',
      scSubmissionID: 0,
      stateTimestamp: new Date().getTime() - 900000, // 900 seconds before now
      articleSubmissionState: ArticleSubmissionState.EDITOR_ASSIGNED,
      editor: 'Tet editor',
      articleVersions: mongoose.Types.ObjectId(),

    });
    await articleSubmission.save();
  },
  createOpenArticleSubmission1: async () => {
    let articleSubmission = new ArticleSubmission({
      ownerAddress: '0x9c51e96A3f5c5E3BeD25242CEe180aC8eAB03E23',
      scSubmissionID: 0,
      stateTimestamp: new Date().getTime() - 900000, // 900 seconds before now
      articleSubmissionState: ArticleSubmissionState.OPEN,
      editor: 'Tet editor',
      articleVersions: mongoose.Types.ObjectId(),

    });
    await articleSubmission.save();
  },
};