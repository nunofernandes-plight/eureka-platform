import React from 'react';
import styled from 'styled-components';
import {getTransactions} from './MyHistoryMethods.js';
import {Card} from '../../views/Card.js';
import Modal from '../../design-components/Modal.js';
import MyHistoryTable from './MyHistoryTable.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

class MyHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      txs: null,
      txsLoading: false,
      errorMessage: null
    };
  }

  componentDidMount() {
    this.setState({txsLoading: true});
    getTransactions()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({txs: response.data.reverse()});
          console.log(response.data);
        } else {
          this.setState({
            errorMessage: response.error,
            txsLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          txsLoading: false
        });
      });
  }

  renderModals() {
    return (
      <div>
        <Modal
          type={'notification'}
          toggle={() => {
            this.setState({errorMessage: null});
          }}
          show={this.state.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        <Card width={1000} title={'Your Ethereum History'}>
          <MyHistoryTable txs={this.state.txs} />
        </Card>
      </Container>
    );
  }
}

export default MyHistory;
