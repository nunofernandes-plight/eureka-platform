import React from 'react';
import styled from 'styled-components';
import {getArticlesToSignOff, getReviewsToCheck} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link, withRouter} from 'react-router-dom';
import {
  assignForSubmissionProcess,
  setSanityToOk
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoArtDiv = styled.div`
  display: flex;
  font-style: italic;
  margin-top: 25px;
  color: ${__THIRD};
  font-size: 16px;
`;
const NoReviews = () => {
  return (
    <NoArtDiv>
      There are currently no reviews to check. If you want to invite reviewers
      to review an article{' '}
      <Link to={'/app/editor/invite'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};
class EditorCheckReviews extends React.Component {
  constructor() {
    super();
    this.state = {
      reviews: null,
      loading: false,
      articleOnHover: null
    };
  }

  async componentDidMount() {
    await this.getReviewsToCheck();
  }

  async getReviewsToCheck() {
    this.setState({loading: true});
    return getReviewsToCheck()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(response);
          this.setState({reviews: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
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
            this.props.history.push('/app/editor/invite');
          }}
          show={this.state.tx}
          title={'We got your request!'}
        >
          The request has successfully trigered our smart contract. You can find
          its tx hash here:{' '}
          <TxHash txHash={this.state.tx}>Transaction Hash</TxHash>. <br />
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
          <Card title={'Check the handed in Reviews'} width={1000}>
            {this.state.reviews ? (
              this.state.reviews.length > 0 ? (
                this.state.reviews.map(review => {
                  return (
                    <Article
                      buttonText={'Accept Article'}
                      key={review.reviewId}
                      article={review}
                      onHover={this.state.articleOnHover === review._id}
                      onMouseEnter={id => {
                        this.setState({articleOnHover: id});
                      }}
                      onMouseLeave={id => {
                        this.setState({articleOnHover: null});
                      }}
                      action={(_, article) => {
                        console.log('here');
                      }}
                    />
                  );
                })
              ) : (
                <NoReviews />
              )
            ) : (
              <NoReviews />
            )}
          </Card>
        )}
      </Container>
    );
  }
}
export default withRouter(EditorCheckReviews);
