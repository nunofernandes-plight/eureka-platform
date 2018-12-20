import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
  assignForSubmissionProcess, removeEditorFromSubmissionProcess
} from '../../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Button from '../../../design-components/Button.js';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {addTransaction} from '../../../reducers/transactions.js';
import SC_TRANSACTIONS_TYPE from '../../../../../backend/schema/sc-transaction-state-enum.mjs';
import {fetchingArticleData} from '../../../reducers/article.js';
import {EditorInfoMessage, EditorSuccessMessage} from '../../../constants/Messages.js';
import {isGanache} from '../../../../../helpers/isGanache.mjs';
import toast from '../../../design-components/Notification/Toast.js';

const MyButton = styled(Button) `
  width: 100%;
`;

export const resignEditor = async (web3Context, props) => {
  let gasAmount;
  // gas estimation on ganache doesn't work properly
  if (!isGanache(web3Context.web3))
    gasAmount = await removeEditorFromSubmissionProcess(
      web3Context.platformContract,
      props.article.articleSubmission.scSubmissionID
    ).estimateGas({
      from: props.selectedAccount.address
    });
  else gasAmount = 80000000;

  removeEditorFromSubmissionProcess(
    web3Context.platformContract,
    props.article.articleSubmission.scSubmissionID
  )
    .send({
      from: props.selectedAccount.address,
      gas: gasAmount
    })
    .on('transactionHash', tx => {
      props.addTransaction(
        SC_TRANSACTIONS_TYPE.REMOVE_EDITOR_FROM_SUBMISSION,
        tx
      );
      toast.info('You will be removed from the submission process in the next minutes.');
    })
    .on('receipt', receipt => {
      toast.success(`You have been sucessfully removed from the article submission process.`);
      props.fetchingArticleData(props.article._id);
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
  fetchingArticleData: (articleId) => {
    dispatch(fetchingArticleData(articleId));
  }
});

export const ResignAsEditorButton = connect(mapStateToProps, mapDispatchToProps)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <MyButton
            onClick={() => {
              resignEditor(web3Context, props, () => {
                props.fetchingArticleData(props.article._id);
              });
            }}
            title={'Resign yourself from the handling editor position.'}
          >
            Resign from Editor Position
          </MyButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
