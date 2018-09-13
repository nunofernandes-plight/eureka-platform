import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import EditorQuerySection from './EditorQuerySection.js';
import {getUnassignedSubmissions} from './EditorMethods.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import ArticleCard from '../../views/ArticleCard.js';
import {assignForSubmissionProcess} from '../../../../backend/web3/web3-platform-contract-methods.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1em;
`;

class EditorArticles extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      articles: null,
      filtersActive: false,
      loading: false,
      articleOnHover: null
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {
    this.setState({loading: true});
    getUnassignedSubmissions()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({articles: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  assignArticle(id) {
    assignForSubmissionProcess(this.props.platformContract);
  }

  renderModals() {
    return (
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
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <Card width={1000} title={'Allocate articles'}>
          <EditorQuerySection
            checked={this.state.filtersActive}
            handleFilters={filtersActive => {
              this.setState({filtersActive});
            }}
            handleQuery={(field, value) => {
              this.handleQuery(field, value);
            }}
          />

          {!this.state.articles ? (
            <GridSpinner />
          ) : (
            <Articles>
              {this.state.articles.map(article => {
                return (
                  <Article
                    key={article._id}
                    onHover={this.state.articleOnHover === article._id}
                    article={article}
                    onMouseEnter={id => {
                      this.setState({articleOnHover: id});
                    }}
                    onMouseLeave={id => {
                      this.setState({articleOnHover: null});
                    }}
                    assignArticle={id => {
                      this.assignArticle(id);
                    }}
                  />
                );
              })}
            </Articles>
          )}
        </Card>
      </Container>
    );
  }
}

export default EditorArticles;
