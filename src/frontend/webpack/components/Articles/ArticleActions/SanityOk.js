import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {setSanityToOk} from '../../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Button from '../../../design-components/Button.js';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {addTransaction} from '../../../reducers/transactions.js';
import SC_TRANSACTIONS_TYPE from '../../../../../backend/schema/sc-transaction-state-enum.mjs';
import {fetchingArticleData} from '../../../reducers/article.js';

const MyButton = styled(Button) `
  //width: 100%;
`;

export const signOffArticle = (platformContract, props, callback) => {
  setSanityToOk(platformContract, props.article.articleHash)
    .send({
      from: props.selectedAccount.address
    })
    .on('transactionHash', tx => {
      props.addTransaction(
        SC_TRANSACTIONS_TYPE.SANITY_OK,
        tx
      );
      // TODO: this toast!
    })
    .on('receipt', async receipt => {
      console.log(
        'Accepting the article`s sanity exited with the TX status: ' +
        receipt.status
      );
      callback();
    })
    .catch(err => {
      console.error(err);
    });
};

const mapStateToProps = state => ({
  selectedAccount: state.accountsData.selectedAccount
});

const mapDispatchToProps = dispatch => ({
  addTransaction: (txType, tx) => {
    dispatch(addTransaction(txType, tx));
  },
  fetchingArticleData: (articleId) => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const SanityCheckAcceptButton = connect(mapStateToProps, mapDispatchToProps)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <MyButton
            onClick={() => {
              signOffArticle(web3Context.platformContract, props, () => {
                props.fetchingArticleData(props.article._id);
              });
            }}
            title={'The sanity of the article is ok and it is released for the peer review process'}
          >
            Sanity OK
          </MyButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
