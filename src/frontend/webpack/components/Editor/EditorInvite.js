import React, {Fragment} from 'react';
import styled from 'styled-components';
import {getInviteReviewersArticles} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link, withRouter} from 'react-router-dom';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';
import EdiorReviewersPicker from './EdiorReviewersPicker.js';
import EmailPreview from '../Email/EmailPreview.js';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import {inviteReviewersForArticle} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import SendEmailAnimation from './SendEmailAnimation.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoArtDiv = styled.div`
  display: flex;
  font-style: italic;
  margin-top: 25px;
  color: ${__THIRD};
  font-size: 16px;
`;

const NoArticles = () => {
  return (
    <NoArtDiv>
      You don't have any articles for which you can invite reviewers. If you
      want to assign yourself to an article{' '}
      <Link to={'/app/editor/articles'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};

class EditorInvite extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      article: null,
      loading: false,
      articleOnHover: null,
      showReviewersPickerModal: false,
      reviewersToInvite: null,
      showSendEmailAnimation: false
    };
  }

  async componentDidMount() {
    await this.getInviteReviewersArticles();
  }

  async getInviteReviewersArticles() {
    this.setState({loading: true});
    return getInviteReviewersArticles()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(response);
          this.setState({articles: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
      });
  }

  async inviteReviewers() {
    if (!this.state.reviewersToInvite) return;
    /*
    this.setState({showReviewersPickerModal: false});*/
    const reviewers = this.state.reviewersToInvite.map(r => {
      return r.ethereumAddress;
    });
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.context.web3))
      gasAmount = await inviteReviewersForArticle(
        this.props.context.platformContract,
        this.state.article.articleHash,
        reviewers
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    inviteReviewersForArticle(
      this.props.context.platformContract,
      this.state.article.articleHash,
      reviewers
    )
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({
          showSendEmailAnimation: true
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

  renderModals() {
    return (
      <div>
        <Modal
          type={'notification'}
          toggle={isErrorMessage => {
            this.setState({errorMessage: null});
          }}
          show={this.state.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage}
        </Modal>

        <Modal
          toggle={isTx => {
            this.setState({tx: null});
          }}
          action={'GOT IT'}
          callback={() => {
            this.props.history.push('/app/editor/reviews');
          }}
          show={this.state.tx}
          title={'We got your request!'}
        >
          This article successfully passed the sanity check! You can find its tx
          hash here: <TxHash txHash={this.state.tx}>Transaction Hash</TxHash>.{' '}
          <br />
        </Modal>

        <Modal
          toggle={showReviewersPickerModal => {
            this.setState({showReviewersPickerModal});
            this.setState({article: null});
          }}
          hideHeader={this.state.showSendEmailAnimation}
          hideFooter={this.state.showSendEmailAnimation}
          action={'SEND INVITATIONS'}
          callback={async () => {
            await this.inviteReviewers();
          }}
          show={this.state.showReviewersPickerModal}
          title={'Invite Reviewers for the article: '}
        >
          {this.state.showSendEmailAnimation ? (
            <div style={{margin: '-24px'}}>
              <SendEmailAnimation
                onComplete={() => {
                  this.setState({
                    showReviewersPickerModal: false,
                    showSendEmailAnimation: false
                  });
                }}
              />
            </div>
          ) : (
            <Fragment>
              <EmailPreview
                reviewersToInvite={this.state.reviewersToInvite}
                article={this.state.article}
                selectedAccount={this.props.selectedAccount}
              />
              <EdiorReviewersPicker
                article={this.state.article}
                selectedAccount={this.props.selectedAccount}
                reviewersToInvite={this.state.reviewersToInvite}
                addReviewer={u => {
                  const reviewersToInvite = this.state.reviewersToInvite
                    ? [...this.state.reviewersToInvite]
                    : [];
                  reviewersToInvite.push(u);
                  this.setState({
                    reviewersToInvite
                  });
                }}
                removeReviewer={u => {
                  const reviewersToInvite = [...this.state.reviewersToInvite];
                  const indexToDelete = reviewersToInvite
                    .map(ur => {
                      return ur.ethereumAddress;
                    })
                    .indexOf(u.ethereumAddress);
                  if (indexToDelete > -1) {
                    reviewersToInvite.splice(indexToDelete, 1);
                  }
                  this.setState({
                    reviewersToInvite
                  });
                }}
              />
            </Fragment>
          )}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Container>
          {this.renderModals()}
          {this.state.loading ? (
            <GridSpinner />
          ) : (
            <Card title={'Invite to Review an Article'}>
              <Link to={'/app/reviewers'}>
                <button>See all reviewers in the community</button>
              </Link>
              {this.state.articles ? (
                this.state.articles.length > 0 ? (
                  this.state.articles.map(article => {
                    return (
                      <Article
                        buttonText={'Invite Reviewers'}
                        key={article._id}
                        article={article}
                        onHover={this.state.articleOnHover === article._id}
                        onMouseEnter={obj => {
                          this.setState({articleOnHover: obj._id});
                        }}
                        onMouseLeave={obj => {
                          this.setState({articleOnHover: null});
                        }}
                        action={(_, article) => {
                          this.setState({
                            showReviewersPickerModal: true,
                            article
                          });
                        }}
                      />
                    );
                  })
                ) : (
                  <NoArticles />
                )
              ) : (
                <NoArticles />
              )}
            </Card>
          )}
        </Container>
      </Fragment>
    );
  }
}

export default withWeb3(
  withRouter(
    connect(state => ({
      selectedAccount: state.accountsData.selectedAccount
    }))(EditorInvite)
  )
);
