import React, {Fragment} from 'react';
import styled from 'styled-components';
import connect from 'react-redux/es/connect/connect.js';
import {fetchTransactions} from '../../reducers/transactions.js';
import UploadProgressContainer from '../Articles/Online/TextEditor/UploadProgressContainer.js';
import Transaction, {TxLi} from './Transaction.js';

const Container = styled.ol`
  list-style-type: none;
  margin: 0;
  background: white;
  padding-left: 0;
  padding-top: 45px;
`;

class Transactions extends React.Component {
  componentDidMount() {
    this.props.fetchTransactions();
    this.interval = setInterval(async () => {
      this.props.fetchTransactions();
    }, 7500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container>
        {!this.props.txs ? (
          <TxLi>
            <UploadProgressContainer />
          </TxLi>
        ) : (
          <Fragment>
            {this.props.txs.reverse().map(tx => {
              return <Transaction key={tx.txHash} tx={tx} />;
            })}
          </Fragment>
        )}
      </Container>
    );
  }
}

export default connect(
  state => ({
    txs: state.transactionsData.txs,
    loading: state.transactionsData.fetchingTxLoading
  }),
  dispatch => {
    return {
      fetchTransactions: () => {
        dispatch(fetchTransactions());
      }
    };
  }
)(Transactions);
