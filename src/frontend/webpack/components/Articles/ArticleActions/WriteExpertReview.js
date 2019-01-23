import React from 'react';
import {connect} from 'react-redux';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__FIFTH} from '../../../../helpers/colors.js';
import {WRITE_EXPERT_REVIEW} from './ButtonsNaming.js';
import {addCommunityReviewToDB} from '../../Reviews/ReviewMethods.js';
import {withRouter} from 'react-router-dom';

const mapStateToProps = state => ({
  selectedAccount: state.accountsData.selectedAccount
});

const mapDispatchToProps = dispatch => ({
  fetchingArticleData: articleId => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const WriteExpertReviewButton = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <ActionButton
            icon={'edit'}
            dataTip={'writeExpertReview'}
            background={__FIFTH}
            onClick={() => {
              // TODO: change to addExpertRevieToDB
              addCommunityReviewToDB({
                articleHash: props.article.articleHash
              })
                .then(response => response.json())
                .then(response => {
                  if (response.success) {
                    props.history.push(
                      `/app/write/review/${response.data._id}`
                    );
                  }
                })
                .catch(err => {});
            }}
            title={WRITE_EXPERT_REVIEW.tooltip}
          >
            {WRITE_EXPERT_REVIEW.label}
          </ActionButton>
        );
      }}
    </Web3Context.Consumer>
  );
}));
