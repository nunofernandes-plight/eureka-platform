import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {withRouter} from 'react-router-dom';
import {getMyReviews} from './ReviewMethods.js';
import {__THIRD} from '../../../helpers/colors.js';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import {
  addCommunityReview,
  addEditorApprovedReview
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {getEtherscanLink} from '../../../../helpers/getEtherscanLink.js';
import REVIEW_TYPE from '../../../../backend/schema/review-type-enum.mjs';

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
  return <NoArtDiv>There are no reviews to display.</NoArtDiv>;
};

class ReviewsOpen extends React.Component {
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
    await this.getMyReviews();
  }

  async getMyReviews() {
    this.setState({loading: true});
    return getMyReviews()
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

  async submitEditorApprovedReview(review) {
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await addEditorApprovedReview(
        this.props.platformContract,
        review.articleHash,
        review.reviewHash,
        review.articleHasMajorIssues,
        review.articleHasMinorIssues,
        review.score1,
        review.score2
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    addEditorApprovedReview(
      this.props.platformContract,
      review.articleHash,
      review.reviewHash,
      review.articleHasMajorIssues,
      review.articleHasMinorIssues,
      review.score1,
      review.score2
    )
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({
          showTxModal: true,
          tx
        });
        //TODO Redirect to article preview and review editor
      })
      .on('receipt', async receipt => {
        console.log('Submitting Editor Approved Review:  ' + receipt.status);
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

  async submitCommunityReview(review) {
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await addCommunityReview(
        this.props.platformContract,
        review.articleHash,
        review.reviewHash,
        review.articleHasMajorIssues,
        review.articleHasMinorIssues,
        review.score1,
        review.score2
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    addCommunityReview(
      this.props.platformContract,
      review.articleHash,
      review.reviewHash,
      review.articleHasMajorIssues,
      review.articleHasMinorIssues,
      review.score1,
      review.score2
    )
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({
          showTxModal: true,
          tx
        });
        //TODO Redirect to article preview and review editor
      })
      .on('receipt', async receipt => {
        console.log('Submitting Community Review:  ' + receipt.status);
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
          title={'Your Review has been successfully sent!'}
        >
          Dear reviewer, your request for submitting a review has successfully
          triggered our Smart Contract. If you are interested, you can track the
          Blockchain approval process at the following link: <br />
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
          <Card title={'My Reviews'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={
                        'dummy: send review to SC / later: Edit review'
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
                      action={(_, article) => {
                        this.setState({
                          article
                        });
                        //TODO Redirect to article preview and review editor
                        // dummy
                        if (
                          article.reviewType ===
                          REVIEW_TYPE.EDITOR_APPROVED_REVIEW
                        )
                          this.submitEditorApprovedReview(article);
                        else this.submitCommunityReview(article);
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

export default withRouter(ReviewsOpen);
