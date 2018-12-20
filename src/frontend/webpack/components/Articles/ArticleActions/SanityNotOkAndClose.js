import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {setSanityIsNotOk} from '../../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {addTransaction} from '../../../reducers/transactions.js';
import SC_TRANSACTIONS_TYPE from '../../../../../backend/schema/sc-transaction-state-enum.mjs';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__ALERT_DANGER} from '../../../../helpers/colors.js';
import {SANITY_NOT_OK_CLOSE} from './ButtonsNaming.js';

export const sanityNotOkAndClose = (platformContract, props) => {
  //TODO: set to setSanityIsNotOkAndClose
  setSanityIsNotOk(platformContract, props.article.articleHash)
    .send({
      from: props.selectedAccount.address
    })
    .on('transactionHash', tx => {
      props.addTransaction(SC_TRANSACTIONS_TYPE.SANITY_NOT_OK, tx);
      // TODO: this toast!
    })
    .on('receipt', async receipt => {
      console.log(
        'Declining the article`s sanity exited with the TX status: ' +
          receipt.status
      );
      props.fetchingArticleData(props.article._id);
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
  fetchingArticleData: articleId => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const SanityCheckDeclineAndCloseButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <ActionButton
            icon={'rejectAndClose'}
            background={__ALERT_DANGER}
            dataTip={'sanityNotOkAndClose'}
            onClick={() => {
              sanityNotOkAndClose(web3Context.platformContract, props);
            }}
            title={
              'Request a new article version since the sanity of this version is not ok.'
            }
          >
            {SANITY_NOT_OK_CLOSE}
          </ActionButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
