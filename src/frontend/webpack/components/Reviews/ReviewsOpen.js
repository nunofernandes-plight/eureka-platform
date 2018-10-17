import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {withRouter} from 'react-router-dom';
import {
  addCommunityReviewToDB,
  getArticlesOpenToReview
} from './ReviewMethods.js';
import {__THIRD} from '../../../helpers/colors.js';

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
  return <NoArtDiv>There are currently no articles to review.</NoArtDiv>;
};

class ReviewsOpen extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      article: null,
      loading: false,
      articleOnHover: null,
      errorMessage: false
    };
  }

  async componentDidMount() {
    await this.getArticlesOpenToReview();
  }

  async getArticlesOpenToReview() {
    this.setState({loading: true});
    return getArticlesOpenToReview()
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
          <Card title={'Articles open to review'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={'Write a Review'}
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
                        this.setState({loading: true});
                        addCommunityReviewToDB({
                          articleHash: article.articleHash
                        })
                          .then(response => response.json())
                          .then(response => {
                            if (response.success) {
                              this.setState({loading: false});
                              this.props.history.push(
                                `/app/write/review/${response.data._id}`
                              );
                            }
                          })
                          .catch(err => {
                            this.setState({
                              loading: false,
                              errorMessage: err
                            });
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
    );
  }
}

export default withRouter(ReviewsOpen);
