import articleVersionService from '../db/article-version-service.mjs';
import reviewService from '../db/review-service.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';
import REVIEW_STATE from '../schema/review-state-enum.mjs';

export default {
  getAnalytics: async userAddress => {
    const drafts = await articleVersionService.getArticleVersionsByStateAndUser(
      ARTICLE_VERSION_STATE.DRAFT,
      userAddress
    );
    const submitted = await articleVersionService.getArticleVersionsByStateAndUser(
      ARTICLE_VERSION_STATE.SUBMITTED,
      userAddress
    );

    const invitations = await reviewService.getReviewsByStateAndUser(
      userAddress,
      REVIEW_STATE.INVITED
    );

    const openToReview = await articleVersionService.getArticlesOpenForCommunityReviews(
      userAddress
    );

    const myReviews = await reviewService.getMyReviews(userAddress);

    const totalDrafts = drafts.length;
    const totalSubmitted = submitted.length;
    const totalInvitations = invitations.length;
    const totalReviews = myReviews.length;
    const totalOpenArticles = openToReview.length;
    return [
      {
        title: 'Articles',
        icon: 'dashboardArticles',
        drafts: totalDrafts,
        submitted: totalSubmitted
      },
      {
        title: 'Reviews',
        icon: 'myReviews',
        submitted: totalReviews,
        invitations: totalInvitations,
        openArticles: totalOpenArticles
      }
    ];
  }
};
