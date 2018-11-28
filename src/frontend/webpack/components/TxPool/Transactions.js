import React, {Fragment} from 'react';
import styled from 'styled-components';
import {__GRAY_200, __GRAY_300} from '../../../helpers/colors.js';
import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect.js';
import {fetchUserData} from '../../reducers/user.js';
import {fetchTransactions} from '../../reducers/transactions.js';
import UploadProgressContainer from '../TextEditor/UploadProgressContainer.js';

const Container = styled.ol`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const TxLi = styled.li`
  &:hover {
    cursor: pointer;
    background: ${__GRAY_200};
  }
  transition: 0.3s ease-in-out all;
  background: white;
  padding: 2em;
  border-bottom: ${__GRAY_300};
`;

const getData = () => {
  return [
    {txHash: 12412412},
    {txHash: 1241241},
    {txHash: 1412},
    {txHash: 12412}
  ];
};

class Transactions extends React.Component {
  componentDidMount() {
    this.props.fetchTransactions();
    this.interval = setInterval(async () => {
      this.props.fetchTransactions();
    }, 3500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container>
        {this.props.loading ? (
          <TxLi>
            <UploadProgressContainer />
          </TxLi>
        ) : (
          <Fragment>
            {' '}
            {getData().map(tx => {
              return <TxLi key={tx.txHash}>{tx.txHash}</TxLi>;
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
