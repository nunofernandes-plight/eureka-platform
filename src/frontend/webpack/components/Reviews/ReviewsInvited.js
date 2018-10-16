import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {Link, withRouter} from 'react-router-dom';
import {
  saveReviewDraftToDB,
  getArticlesInvitedForReviewing
} from './ReviewMethods.js';
import {__THIRD} from '../../../helpers/colors.js';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import {acceptReviewInvitation} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {getEtherscanLink} from '../../../../helpers/getEtherscanLink.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
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
      There are no articles you are invited to review. See all articles open for
      reviewing by{' '}
      <Link to={'/app/reviews/open'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>clicking here</strong>.
      </Link>
    </NoArtDiv>
  );
};

class ReviewsInvited extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      article: null,
      loading: false,
      articleOnHover: null,
      errorMessage: false,

      showTxModal: false,
      tx: null
    };
  }

  async componentDidMount() {
    await this.getArticlesInvitedForReviewing();
  }

  async getArticlesInvitedForReviewing() {
    this.setState({loading: true});
    return getArticlesInvitedForReviewing()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({articles: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
      });
  }

  async acceptReviewInvitation(article) {
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await acceptReviewInvitation(
        this.props.platformContract,
        article.articleHash
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    acceptReviewInvitation(this.props.platformContract, article.articleHash)
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({
          showTxModal: true,
          tx
        });
        this.getArticlesInvitedForReviewing();
        //TODO Redirect to article preview and review editor
      })
      .on('receipt', async receipt => {
        console.log('Accepted Review Invitation:  ' + receipt.status);
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
          action={'GOT IT'}
          callback={() => {
            this.setState({showTxModal: false});
          }}
          noClose
          show={this.state.showTxModal}
          title={'Your invitation has been successfully accepted!'}
        >
          Dear reviewer, your request for accepting the review invitation has
          successfully triggered our Smart Contract. If you are interested, you
          can track the Blockchain approval process at the following link:{' '}
          <br />
          <a
            href={getEtherscanLink(this.props.network) + 'tx/' + this.state.tx}
            target={'_blank'}
          >
            {this.state.tx}{' '}
          </a>
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        {this.state.loading ? (
          <GridSpinner />
        ) : (
          <Card title={'Articles you are invited to review'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={
                        article.reviewState === 'INVITED'
                          ? 'Accept Invitation'
                          : 'Write Review'
                      }
                      key={article._id}
                      article={article}
                      onHover={this.state.articleOnHover === article._id}
                      onMouseEnter={id => {
                        this.setState({articleOnHover: id});
                      }}
                      onMouseLeave={id => {
                        this.setState({articleOnHover: null});
                      }}
                      action={async (_, article) => {
                        if (article.reviewState === 'INVITED') {
                          await this.acceptReviewInvitation(article);
                        } else {
                          await saveReviewDraftToDB({
                            reviewId: article.reviewId
                          });
                          this.props.history.push(
                            `/app/write/review/${article.reviewId}
                            `
                          );
                        }
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
    );
  }
}

export default withRouter(ReviewsInvited);
