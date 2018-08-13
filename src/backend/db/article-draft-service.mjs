import ArticleDraft from '../schema/article-draft';

export default {
  getAllArticleDrafts: () => {
    return ArticleDraft.find({});
  },
  createDraft: ({ethereumAddress}) => {
    const newDraft = new ArticleDraft({
      ownerAddress: ethereumAddress
    });
    return newDraft.save( err => {
      if (err) throw  err;
      console.log('Created new article draft on DB done');
    });
  }
}