import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {withRouter} from 'react-router-dom';
import {
  addCommunityReviewToDB,
} from './ReviewMethods.js';
import {__THIRD} from '../../../helpers/colors.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';
import {fetchArticlesOpenToReview} from '../../reducers/reviews.js';
import Pagination from '../Editor/Pagination.js';

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

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-top: 1em;
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
      errorMessage: false,
      page: null
    };
  }

  async componentDidMount() {
    this.getArticles(1);
  }

  getArticles(page) {
    this.setState({page});
    this.props.fetchArticlesOpenToReview(page);
  }

  renderModals() {
    return (
      <div>
        <Modal
          type={'notification'}
          toggle={isErrorMessage => {
            this.setState({errorMessage: null});
          }}
          show={this.props.errorMessage}
          title={'You got the following error'}
        >
          {this.props.errorMessage}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <Card title={'Articles open to review'}>

          <Pagination
            currentPage={this.state.page}
            totalPages={this.props.nrOfPages}
            goToPage={page => {
              this.getArticles(page);
            }}
          />

        {this.props.loading ? (
          <GridSpinner />
        ) : (
          <Articles>




            {this.props.articles ? (
              this.props.articles.length > 0 ? (
                this.props.articles.map(article => {
                  return (
                    <Article
                      buttonText={'Write a Review'}
                      key={article._id}
                      article={article}
                      onHover={this.state.articleOnHover === article._id}
                      onMouseEnter={obj => {
                        this.setState({articleOnHover: obj._id});
                      }}
                      onMouseLeave={obj => {
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
          </Articles>
        )}
        </Card>
      </Container>
    );
  }
}

export default withWeb3(
  withRouter(
    connect(
      state => ({
        loading: state.reviewsData.articlesOpenToReviewLoading,
        errorMessage: state.reviewsData.articlesOpenToReviewError,
        articles: state.reviewsData.articlesOpenToReview,
        nrOfPages: state.reviewsData.nrOfPages
      }),
      dispatch => ({
        fetchArticlesOpenToReview: page => {
          dispatch(fetchArticlesOpenToReview(page));
        }
      })
    )(ReviewsOpen)
  )
);
