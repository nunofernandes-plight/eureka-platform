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

    let open = [];
    if (openToReview.length > 2) {
      open = [openToReview[0], openToReview[1], openToReview[2]];
    } else if (openToReview.length === 2) {
      open = [openToReview[0], openToReview[1]];
    } else if (openToReview.length === 1) {
      open = [openToReview[0]];
    }

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
            title: 'Drafts',
            subTitle: 'Continue writing..',
            text: 'drafts have been created by you.',
            start: 'Create your first draft now!',
            total: totalDrafts,
            icon: 'draft',
            content: drafts ? drafts[0] : null,
            path: drafts ? `/app/documents/write/${drafts[0]._id}` : null
          },
          {
            title: 'ArticleSubmissions',
            subTitle: 'Last submitted Article',
            text: 'drafts have been submitted by you.',
            start: 'Submit your first article now!',
            total: totalSubmitted,
            icon: 'submitted',
            content: submitted ? submitted[0] : null,
            path: submitted ? `/app/preview/${submitted[0]._id}` : null
          }
        ]
      },
      {
        title: 'Reviews',
        icon: 'myReviews',
        categories: [
          {
            title: 'ReviewSubmissions',
            subTitle: 'Last submitted Review',
            text: 'reviews have been submitted by you.',
            start: 'Submit your first review now!',
            total: totalReviews,
            icon: 'editorReviewsCheck',
            content: myReviews ? myReviews[0] : null,
            path: '/app/reviews/me'
          },
          {
            title: 'Invitations',
            subTitle: 'Last Invitation to review',
            text: 'review invitations are pending for you.',
            start:
              'You do not have any pending invitations from a handling Editor.',
            total: totalInvitations,
            icon: 'editorInvite',
            content: invitations ? invitations[0] : null,
            path: '/app/reviews/invited'
          },
          {
            title: 'ArticlesToReview',
            subTitle: 'Open Articles to review',
            text: 'articles are available for review for you.',
            total: totalOpenArticles,
            icon: 'openForReview',
            content: open,
            path: '/app/reviews/open'
          }
        ]
      }
    ];
  }
};
