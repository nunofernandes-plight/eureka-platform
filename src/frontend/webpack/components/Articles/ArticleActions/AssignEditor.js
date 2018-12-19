import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
  assignForSubmissionProcess
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

export const assignEditor = async (web3Context, props) => {
  let gasAmount;
  // gas estimation on ganache doesn't work properly
  if (!isGanache(web3Context.web3))
    gasAmount = await assignForSubmissionProcess(
      web3Context.platformContract,
      props.article.articleSubmission.scSubmissionID
    ).estimateGas({
      from: props.selectedAccount.address
    });
  else gasAmount = 80000000;

  assignForSubmissionProcess(
    web3Context.platformContract,
    props.article.articleSubmission.scSubmissionID
  )
    .send({
      from: props.selectedAccount.address,
      gas: gasAmount
    })
    .on('transactionHash', tx => {
      props.addTransaction(
        SC_TRANSACTIONS_TYPE.EDITOR_ARTICLE_ASSIGNMENT,
        tx
      );
      toast.info(
        <EditorInfoMessage
          path={'signoff'}
          text={'Your article will be assigned to you in the next minutes.'}
        />
      );
    })
    .on('receipt', receipt => {
      toast.success(
        <EditorSuccessMessage
          path={'signoff'}
          articleId={props.article._id}
          text={`The article has been successfully assigned to yourself`}
        />
      );
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

export const AssignAsEditorButton = connect(mapStateToProps, mapDispatchToProps)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <MyButton
            onClick={() => {
              assignEditor(web3Context, props);
            }}
            title={'Assign yourself as a handling editor to supervise this submission process.'}
          >
            Assign Me As Editor
          </MyButton>
        );
      }}
    </Web3Context.Consumer>
  );
});
