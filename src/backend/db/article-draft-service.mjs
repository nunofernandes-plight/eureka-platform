import ArticleDraft from '../schema/article-draft';

export default {
  getAllArticleDrafts: () => {
    return ArticleDraft.find({});
  },
  createDraft: async (ethereumAddress) => {
    console.log(ethereumAddress);
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
  }
};