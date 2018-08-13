import ArticleDraft from '../schema/article-draft.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

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
      errorThrower.noCreationOfEntry('Article Draft');
    }

    return dbDraft;
  },

  getDraftById: async (userAddress, draftId) => {
    let draft = await ArticleDraft.findById(draftId);
    if(!draft) {
      errorThrower.noEntryFoundById(draftId);
    }
    if(draft.ownerAddress !== userAddress) {
      errorThrower.notCorrectEthereumAddress();
    }
    return draft;
  }
};