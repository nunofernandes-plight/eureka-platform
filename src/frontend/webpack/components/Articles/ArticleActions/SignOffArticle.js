import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {setSanityToOk} from '../../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Button from '../../../design-components/Button.js';
import {Web3Context} from '../../../contexts/Web3Context.js';
import {addTransaction} from '../../../reducers/transactions.js';

export const signOffArticle = (platformContract, props) => {
  setSanityToOk(platformContract, props.articleHash)
    .send({
      from: props.selectedAccount.address
    })
    .on('transactionHash', tx => {
      // props.onTransactionHash(tx);
    })
    .on('receipt', async receipt => {
      // props.onReceipt(receipt);
    })
    .catch(err => {
      // props.onError(err);
    });
};

const mapStateToProps = state => ({
  selectedAccount: state.accountsData.selectedAccount
});

const mapDispatchToProps = dispatch => ({
  addTransaction: (txType, tx) => {
    dispatch(addTransaction(txType, tx));
  }
});

export const SanityCheckAcceptButton = connect(mapStateToProps, mapDispatchToProps)(props => {
  return (
    <Web3Context.Consumer>
      {web3Context => {
        return (
          <Button
            onClick={() => {
              signOffArticle(web3Context.platformContract, props);
            }}
            title={'The sanity of the article is ok and it is released for the peer review process'}
          >
            Sanity OK
          </Button>
        );
      }}
    </Web3Context.Consumer>
  );
});
