import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
  declineArticleVersion
} from '../../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {addTransaction} from '../../../reducers/transactions.js';
import SC_TRANSACTIONS_TYPE from '../../../../../backend/schema/sc-transaction-state-enum.mjs';
import {fetchingArticleData} from '../../../reducers/article.js';
import ActionButton from './ActionButton.js';
import {__ALERT_DANGER, __ALERT_WARNING} from '../../../../helpers/colors.js';
import {DECLINE_ARTICLE_AND_CLOSE_SUBMISSION, DECLINE_ARTICLE_AND_REQUEST_NEW} from './ButtonsNaming.js';
import {isGanache} from '../../../../../helpers/isGanache.mjs';
import toast from '../../../design-components/Notification/Toast.js';

export const declineArticleAndCloseSubmission = async (web3Context, props, callback) => {
  let gasAmount;
  // gas estimation on ganache doesn't work properly
  if (!isGanache(web3Context.web3))
    gasAmount = await declineArticleVersion(
      web3Context.platformContract,
      props.article.articleHash
    ).estimateGas({
      from: props.selectedAccount.address
    });
  else gasAmount = 80000000;

  declineArticleVersion(
    web3Context.platformContract,
    props.article.articleHash
  ).send({
    from: props.selectedAccount.address,
    gas: gasAmount
  })
    .on('transactionHash', tx => {
      props.addTransaction(SC_TRANSACTIONS_TYPE.ARTICLE_DECLINED_AND_NEW_REQUESTED, tx);
      // toast.info(
      //   <EditorInfoMessage
      //     path={'signoff'}
      //     text={'Your article will be assigned to you in the next minutes.'}
      //   />
      // );
    })
    .on('receipt', async receipt => {
      console.log(
        'Declining article version with article hash ' +
        props.article.articleHash +
        ' exits with status ' +
        receipt.status
      );
      callback();
    })
    .catch(err => {
      toast.error(err.toLocaleString(), {autoClose: false});
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

export const DeclineArticleAndCloseButton = connect(
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
            dataTip={'declineArticleAndRequest'}
            onClick={() => {
              declineArticleAndCloseSubmission(web3Context, props, () => {
                props.fetchingArticleData(props.article._id);
              });
            }}
            title={DECLINE_ARTICLE_AND_CLOSE_SUBMISSION.tooltip}
          >
            {DECLINE_ARTICLE_AND_CLOSE_SUBMISSION.label}
          </ActionButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
