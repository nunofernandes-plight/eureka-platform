import mongoose from 'mongoose';

/**
 * ArticleDraft for an article draft created by an user, which has not been submitted yet, so it is not written in the SC yet.
 */
export const articleDraftSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
    title: {
      type: String,
    }
  },
  {collection: 'articleDraft'}
);

const ArticleDraft = mongoose.model('ArticleDraft', articleDraftSchema, 'articleDrafts');
export default ArticleDraft;