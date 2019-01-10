import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__ALERT_SUCCESS} from '../../../../helpers/colors.js';
import {CHECK_REVIEWS} from './ButtonsNaming.js';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';

const MyLink = styled(Link)`
  text-decoration: none;
`;

const mapStateToProps = state => ({
  selectedAccount: state.accountsData.selectedAccount
});

const mapDispatchToProps = dispatch => ({
  fetchingArticleData: articleId => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const CheckReviewsButton = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <MyLink to={'/app/editor/reviews'}>
            <ActionButton
              icon={'editorSignOff'}
              background={__ALERT_SUCCESS}
              dataTip={'checkReviews'}
              onClick={() => {}}
              title={CHECK_REVIEWS.tooltip}
            >
              {CHECK_REVIEWS.label}
            </ActionButton>
          </MyLink>
        );
      }}
    </Web3Context.Consumer>
  );
}));
