import React from 'react';
import styled from 'styled-components';
import {fetchArticleByReviewId} from '../TextEditor/DocumentMainMethods.js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
import withRouter from 'react-router/es/withRouter.js';
import Modal from '../../design-components/Modal.js';
import {Card} from '../../views/Card.js';
import {Go} from '../Routers/Go.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {__GRAY_100, __GRAY_200} from '../../../helpers/colors.js';
import PreviewArticle from '../Preview/PreviewArticle.js';
import {Link} from 'react-router-dom';
import SmartContractInputData from '../../views/SmartContractInputData.js';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import {
  addCommunityReview,
  addEditorApprovedReview
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {getEtherscanLink} from '../../../../helpers/getEtherscanLink.js';
import {getAnnotations, saveEditorApprovedReviewToDB} from './ReviewMethods.js';
import {getReviewHash} from '../../../../helpers/getHexAndHash.mjs';
import REVIEW_TYPE from '../../../../backend/schema/review-type-enum.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MySeparator = styled.div`
  height: 2px;
  display: flex;
  width: 75%;
  background: ${__GRAY_100};
  justify-content: center;
  margin-top: 25px;
`;

const MyPreview = styled.div`
  display: flex;
  margin: 0 2em 3%;
  box-shadow: 0 0 0 0.75pt #d1d1d1, 0 0 3pt 0.75pt #ccc;
  padding: 4em;
  background: rgb(255, 255, 255);
`;

const MyContainer = styled.div`
  flex: 1;
`;

class ReviewsWriter extends React.Component {
  constructor() {
    super();
    this.state = {
      document: null,
      article: null,
      review: null,
      annotations: null,

      errorMessage: null,
      submitModal: false,
      tx: null
    };
  }

  componentDidMount() {
    const reviewId = this.props.match.params.reviewId;
    fetchArticleByReviewId(reviewId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let document = new Document(response.data.article.document);
          let deserialized = deserializeDocument(document);
          this.setState({
            document: deserialized,
            article: response.data.article,
            review: response.data.review
          });
        } else {
          this.setState({
            errorMessage: response.error
          });
        }
        this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  renderModal() {
    return (
      <div>
        {' '}
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
          action={'Submit'}
          type={'notification'}
          toggle={toogle => {
            this.setState({submitModal: false});
          }}
          callback={() => {
            this.setState({submitModal: false});
            this.submitReview();
          }}
          show={this.state.submitModal}
          title={'Submit this Review'}
        >
          Are you sure you want to submit this review?
        </Modal>

        <Modal
          action={'GOT IT'}
          callback={() => {
            this.setState({tx: null});
          }}
          noClose
          show={this.state.tx}
          title={'Your Review has been successfully sent!'}
        >
          Dear reviewer, your request for submitting a review has successfully
          triggered our Smart Contract. If you are interested, you can track the
          Blockchain approval process at the following link: <br/>
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

  async submitReview() {
    await getAnnotations(this.state.review._id)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({annotations: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
        console.error(err);
      });

    const reviewHash = '0x' +
      getReviewHash(this.state.review, this.state.annotations);

    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
        gasAmount = await this.getAddReviewFn(reviewHash).estimateGas({
          from: this.props.selectedAccount.address
        });
    else gasAmount = 80000000;

    this.getAddReviewFn(reviewHash)
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({
          showTxModal: true,
          tx
        });
      })
      .on('receipt', async receipt => {
        console.log('Submitting Review:  ' + receipt.status);
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

  getAddReviewFn(reviewHash) {
    if (this.state.review.reviewType === REVIEW_TYPE.EDITOR_APPROVED_REVIEW)
      return addEditorApprovedReview(
        this.props.platformContract,
        this.state.article.articleHash,
        reviewHash,
        //TODO: update
        false, //this.state.review.articleHasMajorIssues,
        false, //this.state.review.articleHasMinorIssues,
        5, //this.state.review.score1,
        10 //this.state.review.score2
      );
    else
      return addCommunityReview(
        this.props.platformContract,
        this.state.article.articleHash,
        reviewHash,
        //TODO: update
        false, //this.state.review.articleHasMajorIssues,
        false, //this.state.review.articleHasMinorIssues,
        5, //this.state.review.score1,
        10 //this.state.review.score2
      );
  }

  render() {
    return (
      <Container>
        {this.renderModal()}
        <Card title={'Write Your Review'} background={__GRAY_200}>
          <Go back {...this.props} />
          <MySeparator/>
          {!this.state.document ? (
            <GridSpinner/>
          ) : (
            <MyPreview>
              {' '}
              <MyContainer>
                {this.props.selectedAccount.address ? (
                  <PreviewArticle
                    selectedAccount={this.props.selectedAccount}
                    documentId={this.props.match.params.id}
                    base={this.props.base}
                    document={this.state.document}
                  />
                ) : (
                  <GridSpinner/>
                )}
              </MyContainer>
            </MyPreview>
          )}
          <button onClick={() => {
            this.setState({submitModal: true});
          }}>
            Submit this Review
          </button>
        </Card>
      </Container>
    );
  }
}

export default withRouter(ReviewsWriter);
