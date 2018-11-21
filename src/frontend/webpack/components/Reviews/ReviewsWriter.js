import React from 'react';
import styled from 'styled-components';
import {fetchArticleByReviewId} from '../TextEditor/DocumentMainMethods.js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
import withRouter from 'react-router/es/withRouter.js';
import Modal from '../../design-components/Modal.js';
import {Card} from '../../views/Card.js';
import {Go} from '../Routers/Go.js';
import {__GRAY_100, __GRAY_200} from '../../../helpers/colors.js';
import PreviewArticle from '../Preview/PreviewArticle.js';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import {
  addCommunityReview,
  addEditorApprovedReview
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {getEtherscanLink} from '../../../../helpers/getEtherscanLink.js';
import {
  addAnnotation,
  deleteAnnotation,
  getAnnotations,
  saveAnnotation,
  updateReview
} from './ReviewMethods.js';
import {getReviewHash} from '../../../../helpers/getHexAndHash.mjs';
import REVIEW_TYPE from '../../../../backend/schema/review-type-enum.mjs';
import EurekaRotateSpinner from '../../views/spinners/EurekaRotateSpinner.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';

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

  async componentDidMount() {
    const reviewId = this.props.match.params.reviewId;
    await this.fetchArticle(reviewId);
    await this.getAnnotations(reviewId);
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
          Blockchain approval process at the following link: <br />
          <a href={+'tx/' + this.state.tx} target={'_blank'}>
            {this.state.tx}{' '}
          </a>
        </Modal>
      </div>
    );
  }

  async fetchArticle(reviewId) {
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

    const reviewHash =
      '0x' + getReviewHash(this.state.review, this.state.annotations);

    // save the review to the DB first
    let review = this.state.review;
    review.reviewHash = reviewHash;
    await updateReview(review);

    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.context.web3))
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
        this.props.context.platformContract,
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
        this.props.context.platformContract,
        this.state.article.articleHash,
        reviewHash,
        //TODO: update
        false, //this.state.review.articleHasMajorIssues,
        false, //this.state.review.articleHasMinorIssues,
        5, //this.state.review.score1,
        10 //this.state.review.score2
      );
  }

  async getAnnotations() {
    this.setState({loading: true});
    return getAnnotations(this.props.match.params.reviewId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({annotations: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
      });
  }

  addAnnotation(annotationRef, field) {
    const annotations = [...this.state.annotations];
    const reviewId = this.props.match.params.reviewId;
    const articleVersionId = this.state.article._id;
    addAnnotation({
      articleVersionId,
      reviewId,
      field,
      sentenceId: annotationRef.id
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let annotation = response.data;
          annotation.onChange = true;
          annotations.unshift(annotation);
          this.setState({annotations});
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });
  }

  deleteAnnotation = id => {
    const annotations = [...this.state.annotations];
    const index = annotations
      .map(a => {
        return a._id;
      })
      .indexOf(id);

    deleteAnnotation(annotations[index])
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.getAnnotations();
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });
  };

  cancelAnnotation = id => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation.updated) {
      this.getAnnotations();
    } else {
      this.deleteAnnotation(id);
    }
  };

  saveAnnotation = id => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    saveAnnotation(annotation)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({annotations});
          this.getAnnotations();
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });
  };

  editAnnotation = id => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation) {
      annotation.onChange = true;
    }
    this.setState({annotations});
  };

  changeAnnotation = (id, text) => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation) {
      annotation.text = text;
    }
    this.setState({annotations});
  };

  render() {
    return (
      <Container>
        {this.renderModal()}
        <Card title={'Write Your Review'} background={__GRAY_200}>
          <Go back {...this.props} />
          <MySeparator />
          {!this.state.document || !this.state.annotations ? (
            <div style={{margin: 30}}>
              <EurekaRotateSpinner
                background={'white'}
                border={'white'}
                width={80}
                height={80}
              />
            </div>
          ) : (
            <MyPreview>
              {' '}
              <MyContainer>
                <PreviewArticle
                  annotations={this.state.annotations}
                  selectedAccount={this.props.selectedAccount}
                  documentId={this.props.match.params.id}
                  base={this.props.base}
                  document={this.state.document}
                  onAdd={(ref, field) => {
                    this.addAnnotation(ref, field);
                  }}
                  onCancel={id => {
                    this.cancelAnnotation(id);
                  }}
                  onSave={id => {
                    this.saveAnnotation(id);
                  }}
                  onDelete={id => {
                    this.deleteAnnotation(id);
                  }}
                  onEdit={id => {
                    this.editAnnotation(id);
                  }}
                  onChange={(id, text) => {
                    this.changeAnnotation(id, text);
                  }}
                />
              </MyContainer>
            </MyPreview>
          )}
          <button
            onClick={() => {
              this.setState({submitModal: true});
            }}
          >
            Submit this Review
          </button>
        </Card>
      </Container>
    );
  }
}

export default withWeb3(
  withRouter(
    connect(state => ({
      selectedAccount: state.accountsData.selectedAccount
    }))(ReviewsWriter)
  )
);
