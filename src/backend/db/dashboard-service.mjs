import articleVersionService from '../db/article-version-service.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';

export default {
  getAnalytics: async userAddress => {
    const drafts = await articleVersionService.getArticleVersionsByStateAndUser(
      ARTICLE_VERSION_STATE.DRAFT,
      userAddress
    );
    const totalDrafts = drafts.length;
    return {totalDrafts};
  }
};
