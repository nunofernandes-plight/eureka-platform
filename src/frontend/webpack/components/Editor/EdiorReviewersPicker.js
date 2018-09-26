import React from 'react';
import styled from 'styled-components';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';
import UsersSelection from '../UsersSelection.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';
import {
  inviteReviewersForArticle,
  signUpEditor
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {isGanache} from '../../../../helpers/isGanache.mjs';

const Container = styled.div``;
class EdiorReviewersPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      showReviewersModal: false
    };
  }

  componentDidMount() {
    this.fetchReviewers();
  }

  /*async inviteReviewers() {
    const reviewers = ['0x9ea02Ac11419806aB9d5A512c7d79AC422cB36F7'];
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await inviteReviewersForArticle(
        this.props.platformContract,
        article.articleHash,
        reviewers
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    inviteReviewersForArticle(
      this.props.platformContract,
      article.articleHash,
      reviewers
    ).send({
      from: this.props.selectedAccount.address,
      gas: gasAmount
    })
      .on('transactionHash', tx => {
        this.setState({
          tx,
          showTxModal: true
        });
      })
      .on('receipt', async receipt => {
        console.log('Invite Reviewers:  ' + receipt.status);
        await this.getInviteReviewersArticles();
        return receipt;
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errorMessage:
            'Ouh. Something went wrong with the Smart Contract call: ' +
            err.toString()
        });
      });
  }*/

  fetchReviewers() {
    fetch(`${getDomain()}/api/users/roles?role=${Roles.REVIEWER}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({searchableReviewers: response.data});
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderModal() {
    return (
      <Modal
        toggle={isTx => {
          this.setState({tx: null});
        }}
        show={this.state.tx}
        title={'We got your request!'}
      >
        The request of inviting the specified reviewers has successfully
        triggered the smart contract. You can find the transaction status here:{' '}
        <TxHash txHash={this.state.tx}>Transaction Hash</TxHash>. <br />
      </Modal>
    );
  }
  render() {
    return (
      <Container>
        <UsersSelection
          listedTitle={'Reviewers'}
          listedUsers={this.props.reviewersToInvite}
          searchableRoles={[Roles.REVIEWER, Roles.AUTHOR]}
          cannotBeAdded={this.props.selectedAccount.address}
          addToList={u => {
            this.props.addReviewer(u);
          }}
          deleteFromList={u => {
            this.props.removeReviewer(u);
          }}
        />
      </Container>
    );
  }
}

export default EdiorReviewersPicker;
