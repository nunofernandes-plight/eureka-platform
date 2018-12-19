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

const NoTxs = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 0;
`;

const Parent = styled.div`
  overflow: scroll;
  max-height: 75vh;
`;

class Transactions extends React.Component {
  componentDidMount() {
    this.props.fetchTransactions();
    this.interval = setInterval(async () => {
      this.props.fetchTransactions();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container>
        {!this.props.txs ? (
          <div>
            <UploadProgressContainer />
          </div>
        ) : (
          <Parent>
            {this.props.txs.length === 0 ? (
              <NoTxs>
                ⚙️ There are no pending transactions in your pool yet.
              </NoTxs>
            ) : null}

            {this.props.txs.reverse().map(tx => {
              return <Transaction key={tx.txHash} tx={tx} />;
            })}
          </Parent>
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
