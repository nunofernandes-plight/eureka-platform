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
                      action={(_, article) => {
                        // TODO Redirect to article preview and review editor
                        // dummy
                        addCommunityReviewToDB({
                          articleHash: article.articleHash,
                          reviewText: 'dummy text community review',
                          reviewHash:
                            '0x' +
                            '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
                          score1: 10,
                          score2: 5,
                          articleHasMajorIssues: false,
                          articleHasMinorIssues: true
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
