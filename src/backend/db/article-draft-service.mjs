import ArticleDraft from '../schema/article-draft';

export default {
  getAllArticleDrafts: () => {
    return ArticleDraft.find({});
  },
  createDraft: async (ethereumAddress) => {
    const newDraft = new ArticleDraft({
      ownerAddress: ethereumAddress
    });
    let dbDraft =  await newDraft.save();
    if(!dbDraft) {
      let error = new Error('Could not create draft within DB');
      error.status = 500;
      throw error;
    }

    return dbDraft;
  },

  getDraftById: async (draftId) => {
    let draft = await ArticleDraft.findById(draftId);
    if(!draft) {
      let error = new Error('Could not find the draft with the provided ID');
      error.status = 400;
      throw error;
    }
    return draft;
  }
};