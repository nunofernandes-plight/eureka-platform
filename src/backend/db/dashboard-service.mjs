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
        categories: [
          {
            title: 'drafts have been created',
            total: totalDrafts,
            icon: 'draft',
            last: drafts ? drafts[0] : null
          },
          {
            title: 'drafts have been submitted',
            total: totalSubmitted,
            icon: 'submitted',
            last: submitted ? submitted[0] : null
          }
        ]
      },
      {
        title: 'Reviews',
        icon: 'myReviews',
        categories: [
          {
            title: 'reviews have been submitted',
            total: totalReviews,
            icon: 'editorReviewsCheck'
          },
          {
            title: 'review invitations are pending',
            total: totalInvitations,
            icon: 'editorInvite'
          },
          {
            title: 'articles are available for review',
            total: totalOpenArticles,
            icon: 'openForReview'
          }
        ]
      }
    ];
  }
};
