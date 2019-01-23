import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__FIFTH} from '../../../../helpers/colors.js';
import {EDIT_ARTICLE} from './ButtonsNaming.js';
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

export const EditArticleButton = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <MyLink to={'/app/documents/write/' + props.article._id}>
            <ActionButton
              icon={'edit'}
              background={__FIFTH}
              dataTip={'editArticle'}
              title={EDIT_ARTICLE.tooltip}
            >
              {EDIT_ARTICLE.label}
            </ActionButton>
          </MyLink>
        );
      }}
    </Web3Context.Consumer>
  );
}));
