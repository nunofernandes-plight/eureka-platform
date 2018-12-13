import articleVersionService from '../db/article-version-service.mjs';
import reviewService from '../db/review-service.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';
import REVIEW_STATE from '../schema/review-state-enum.mjs';
import {getLimitedObjects} from '../helpers/pagination-helpers.mjs';
import ReviewService from './review-service.mjs';
import articleSubmissionService from './article-submission-service.mjs';
import {getIds} from '../helpers/get-array-of-ids.mjs';

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

    const myReviews = await reviewService.getMyReviews(userAddress);
    const alreadyReviewedIds = ReviewService.getArticleVersionIds(myReviews);
    const submissions = await articleSubmissionService.getReviewableSubmissions(
      userAddress
    );
    const reviewableSubmissionIds = getIds(submissions);

    let openToReview = await getLimitedObjects(
      articleVersionService.getArticlesOpenForCommunityReviews(
        userAddress,
        alreadyReviewedIds,
        reviewableSubmissionIds
      ),
      parseInt('1'),
      parseInt(null)
    );

    let carousel = await getLimitedObjects(
      articleVersionService.getArticlesOpenForCommunityReviews(
        userAddress,
        alreadyReviewedIds,
        reviewableSubmissionIds
      ),
      parseInt('9'),
      parseInt('10')
    );



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
            path:
              drafts && drafts.length > 0
                ? `/app/documents/write/${drafts[0]._id}`
                : ''
          },
          {
            title: 'ArticleSubmissions',
            subTitle: 'Last submitted Article',
            text: 'drafts have been submitted by you.',
            start: 'Submit your first article now!',
            total: totalSubmitted,
            icon: 'submitted',
            content: submitted ? submitted[0] : null,
            path:
              submitted && submitted.length > 0
                ? `/app/preview/${submitted[0]._id}`
                : ''
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
            start: 'You do not have submitted any review yet.',
            total: totalReviews,
            icon: 'editorReviewsCheck',
            content: myReviews && myReviews.length > 0 ? myReviews[0] : null,
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
            content:
              invitations && invitations.length > 0 ? invitations[0] : null,
            path: '/app/reviews/invited'
          },
          {
            title: 'ArticlesToReview',
            subTitle: 'Open Articles to review',
            text: 'articles are available for review for you.',
            total: totalOpenArticles,
            icon: 'openForReview',
            content: carousel,
            path: '/app/reviews/open'
          }
        ]
      }
    ];
  }
};
