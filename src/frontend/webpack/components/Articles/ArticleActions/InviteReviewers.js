import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__ALERT_SUCCESS} from '../../../../helpers/colors.js';
import {INVITE_REVIEWERS} from './ButtonsNaming.js';

const mapDispatchToProps = dispatch => ({
  fetchingArticleData: articleId => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const InviteReviewersButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <ActionButton
            icon={'editorSignOff'}
            background={__ALERT_SUCCESS}
            dataTip={'signOffArticle'}
            onClick={() => {
              //TODO
            }}
            title={INVITE_REVIEWERS.tooltip}
          >
            {INVITE_REVIEWERS.label}
          </ActionButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
