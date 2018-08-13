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
    let dbDraft =  await newDraft.save( err => {
      if (err) throw  err;
      console.log('Created new article draft on DB done');
    });
    return dbDraft;
  }
}