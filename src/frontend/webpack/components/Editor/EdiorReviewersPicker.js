import React from 'react';
import styled from 'styled-components';
import {
  getGasInviteReviewersForArticle,
  inviteReviewersForArticle
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';
import UsersSelection from '../UsersSelection.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';

const Container = styled.div``;
class EdiorReviewersPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      showReviewersModal: false,
      searchableReviewers: null,
      reviewersToInvite: null
    };
  }

  componentDidMount() {
    this.fetchReviewers();
  }

  /*async inviteReviewers() {
    const reviewers = ['0x9ea02Ac11419806aB9d5A512c7d79AC422cB36F7'];

    const gas = await getGasInviteReviewersForArticle(
      this.props.platformContract,
      article.articleHash,
      reviewers,
      this.props.selectedAccount.address
    );
    inviteReviewersForArticle(
      this.props.platformContract,
      article.articleHash,
      reviewers,
      this.props.selectedAccount.address,
      gas
    )
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
  }
*/

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
          listedUsers={this.state.reviewersToInvite}
          searchableRoles={[Roles.REVIEWER, Roles.AUTHOR]}
          addToList={u => {
            const reviewersToInvite = this.state.reviewersToInvite
              ? [...this.state.reviewersToInvite]
              : [];
            reviewersToInvite.push(u);
            this.setState({
              reviewersToInvite
            });
          }}
          deleteFromList={u => {
            const reviewersToInvite = [...this.state.reviewersToInvite];
            console.log(reviewersToInvite);
            const indexToDelete = reviewersToInvite
              .map(ur => {
                return ur.ethereumAddress;
              })
              .indexOf(u.ethereumAddress);
            console.log(indexToDelete);

            console.log(indexToDelete);
            if (indexToDelete > -1) {
              reviewersToInvite.splice(indexToDelete, 1);
            }
            this.setState({
              reviewersToInvite
            });
          }}
        />
      </Container>
    );
  }
}

export default EdiorReviewersPicker;
