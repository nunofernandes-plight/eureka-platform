import mongoose from 'mongoose';

export const journalSchema = mongoose.Schema(
  {
    contractAddress: {
      type: String
    },
    contractOwner: {
      type: String
    },
    minAmountOfEditorApprovedReviews: {
      type: Number
    },
    maxAmountOfRewardedEditorApprovedReviews: {
      type: Number
    },
    minAmountOfCommunityReviews: {
      type: Number
    },
    maxAmountOfRewardedCommunityReviews: {
      type: Number
    },
    sciencemattersFoundationReward: {
      type: Number
    },
    editorReward: {
      type: Number
    },
    linkedArticlesReward: {
      type: Number
    },
    invalidationWorkReward: {
      type: Number
    },
    editorApprovedReviewerRewardPerReviewer: {
      type: Number
    },
    communityReviewerRewardPerReviewer: {
      type: Number
    },
    secondReviewerRewardPerReviewer: {
      type: Number
    },
    submissionFee: {
      type: Number
    },
    maxReviewRounds: {
      type: Number
    }
  },
  {collection: 'journals'}
);

const Journal = mongoose.model('Journal', journalSchema, 'journals');
export default Journal;