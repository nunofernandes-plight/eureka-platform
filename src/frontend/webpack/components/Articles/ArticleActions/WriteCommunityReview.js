import React from 'react';
import {connect} from 'react-redux';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__FIFTH} from '../../../../helpers/colors.js';
import {WRITE_COMMUNITY_REVIEW, WRITE_EXPERT_REVIEW} from './ButtonsNaming.js';
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

export const WriteCommunityReviewButton = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <ActionButton
            icon={'edit'}
            dataTip={'writeCommunityReview'}
            background={__FIFTH}
            onClick={() => {
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
            title={WRITE_COMMUNITY_REVIEW.tooltip}
          >
            {WRITE_COMMUNITY_REVIEW.label}
          </ActionButton>
        );
      }}
    </Web3Context.Consumer>
  );
}));
