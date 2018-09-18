import React from 'react';
import styled from 'styled-components';
import {getArticlesToSignOff} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link} from 'react-router-dom';

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
const NoArticles = () => {
  return (
    <NoArtDiv>
      You don't have any articles to sign off. If you want to assign yourself to
      an article{' '}
      <Link to={'/app/editor/articles'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};
class EditorSignOff extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      loading: false,
      articleOnHover: null
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    await getArticlesToSignOff()
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

  render() {
    return (
      <Container>
        {this.state.loading ? (
          <GridSpinner />
        ) : (
          <Card title={'Sign Off Articles'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={'Sign off article'}
                      key={article._id}
                      article={article}
                      onHover={this.state.articleOnHover === article._id}
                      onMouseEnter={id => {
                        this.setState({articleOnHover: id});
                      }}
                      onMouseLeave={id => {
                        this.setState({articleOnHover: null});
                      }}
                      action={id => {
                        // TODO : select action
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
export default EditorSignOff;
