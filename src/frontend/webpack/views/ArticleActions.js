import React from 'react';
import styled from 'styled-components';
import {__GRAY_600} from '../../helpers/colors.js';
import ARTICLE_VERSION_STATE from '../../../backend/schema/article-version-state-enum.mjs';
import Roles from '../../../backend/schema/roles-enum.mjs';
import ARTICLE_SUBMISSION_STATE from '../../../backend/schema/article-submission-state-enum.mjs';
import {connect} from 'react-redux';
import REVIEW_STATE from '../../../backend/schema/review-state-enum.mjs';

const Actions = styled.div`
  font-size: 14px;
  color: ${__GRAY_600};
  font-style: italic;
`;

const RoleActions = styled.div`
  
`;

const AuthorActions = ({article, user}) => {
  if (article.articleSubmission.ownerAddress === user.ethereumAddress) {
    if (article.articleVersionState === ARTICLE_VERSION_STATE.DRAFT)
      return <RoleActions>Edit Article Draft</RoleActions>;
  }
  return null;
};

const EditorActions = ({article, user}) => {

  if (user.roles.includes(Roles.EDITOR)) {
    if (article.articleSubmission.articleSubmissionState === ARTICLE_SUBMISSION_STATE.OPEN) {
      return <RoleActions>Assign yourself as Editor</RoleActions>;
    }

    if (article.articleSubmission.articleSubmissionState === ARTICLE_SUBMISSION_STATE.EDITOR_ASSIGNED
      && article.articleSubmission.editor === user.ethereumAddress) {

      if (article.articleVersionState === ARTICLE_VERSION_STATE.SUBMITTED)
        return (
          <RoleActions>
            <RoleActions>
              Sign Off Article
            </RoleActions>
            <RoleActions>
              Reject Article Because Of Missing Sanity
            </RoleActions>
            <RoleActions>
              Resign for being editor of this submission process
            </RoleActions>
          </RoleActions>
        );

      if (article.articleVersionState === ARTICLE_VERSION_STATE.OPEN_FOR_ALL_REVIEWERS)
        return (
          <RoleActions>
            {getNumberOfReviewsInformation(article)}
            <RoleActions>
              Invite Reviewers
            </RoleActions>
            {getCheckReviewsButton(article)}
            {getAcceptArticleButton(article)}
            {getDeclineArticleButton(article)}
            {getDeclineArticleAndCloseSubmissionButton(article)}
            {getDeclineArticleNotEnoughReviewerButton(article)}
          </RoleActions>
        );
    }
  }
  return null;
};

const ExpertReviewerActions = ({article, user}) => {
  if (user.roles.includes(Roles.EXPERT_REVIEWER)
    && article.articleSubmission.ownerAddress !== user.ethereumAddress
    && article.articleSubmission.editor !== user.ethereumAddress
    && !article.document.authors.includes(user.ethereumAddress)) {

    const expertReview = article.editorApprovedReviews.find(r => {
      return r.reviewerAddress === user.ethereumAddress;
    });

    const communityReview = article.communityReviews.find(r => {
      return r.reviewerAddress === user.ethereumAddress;
    });

    if (!expertReview && !communityReview)
      return (
        <div>
          <div>Sign Up For Expert Review</div>
          <div>Write Expert Review</div>
        </div>
      );

    if (expertReview) {
      switch (expertReview.reviewState) {

        case (REVIEW_STATE.INVITED):
          return (
            <div>
              <div>Sign Up For Expert Review</div>
              <div>Write Expert Review</div>
            </div>
          );

        case (REVIEW_STATE.SIGNED_UP_FOR_REVIEWING):
          return (
            <div>
              <div>Write Expert Review</div>
              <div>Resign from Expert Reviewing</div>
            </div>
          );

        case (REVIEW_STATE.HANDED_IN_DB):
          return <div>Continue Review</div>;

        case (REVIEW_STATE.HANDED_IN_SC):
          return <div>See Your Review</div>;

        case (REVIEW_STATE.DECLINED):
          return <div>Correct Your Review</div>;

        case (REVIEW_STATE.ACCEPTED):
          return <div>Edit Your Review</div>;

        default:
          return null;
      }
    }
  }
  return null;
};

const CommunityReviewerActions = ({article, user}) => {
  if (user.roles.includes(Roles.REVIEWER)
    && article.articleSubmission.ownerAddress !== user.ethereumAddress
    && article.articleSubmission.editor !== user.ethereumAddress
    && !article.document.authors.includes(user.ethereumAddress)) {

    const expertReview = article.editorApprovedReviews.find(r => {
      return r.reviewerAddress === user.ethereumAddress;
    });

    const communityReview = article.communityReviews.find(r => {
      return r.reviewerAddress === user.ethereumAddress;
    });

    if (!expertReview && !communityReview)
      return <div>Annotate Article as Community Reviewer</div>;

    if (communityReview) {
      switch (communityReview.reviewState) {

        case (REVIEW_STATE.INVITED):
          return <div>Annotate Article as Community Reviewer</div>;

        case (REVIEW_STATE.SIGNED_UP_FOR_REVIEWING):
          return null;

        case (REVIEW_STATE.HANDED_IN_DB):
          return <div>Continue Review</div>;

        case (REVIEW_STATE.HANDED_IN_SC):
          return <div>See Your Review</div>;

        case (REVIEW_STATE.DECLINED):
          return <div>Correct Your Review</div>;

        case (REVIEW_STATE.ACCEPTED):
          return <div>Edit Your Review</div>;

        default:
          return null;
      }
    }
  }
  return null;
};

const getNumberOfReviewsInformation = article => {
  return <div>There are X reviews. Y reviews are unchecked</div>;
};

const getCheckReviewsButton = article => {
  if (getNumberOfCheckableReviews(article) > 0)
    return <RoleActions>
      Check Reviews
    </RoleActions>;
  else
    return null;
};

const getNumberOfCheckableReviews = article => {
  return 1;
};

const getAcceptArticleButton = article => {
  return <RoleActions>
    Accept Article and Publish
  </RoleActions>;
};

const getDeclineArticleButton = article => {
  return <RoleActions>
    Decline Article and Request a new article version
  </RoleActions>;
};

const getDeclineArticleAndCloseSubmissionButton = article => {
  return <RoleActions>
    Decline Article and Close Submission Process
  </RoleActions>;
};

const getDeclineArticleNotEnoughReviewerButton = article => {
  return <RoleActions>
    Close submission process because not enough reviewers found
  </RoleActions>;
};


const mapStateToProps = state => ({
  user: state.userData.data
});

const ArticleActions = connect(mapStateToProps)(({article, user}) => {
  return (
    <Actions>
      <AuthorActions article={article} user={user}/>
      <EditorActions article={article} user={user}/>
      <ExpertReviewerActions article={article} user={user}/>
      <CommunityReviewerActions article={article} user={user}/>
    </Actions>
  );
});

export default ArticleActions;
