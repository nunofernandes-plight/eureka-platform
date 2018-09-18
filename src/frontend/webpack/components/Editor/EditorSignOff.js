import React from 'react';
import styled from 'styled-components';
import {getArticlesToSignOff} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
`;
class EditorSignOff extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      loading: false
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
            {this.state.articles
              ? this.state.articles.map(article => {
                  return (
                    <Article
                      key={article._id}
                      article={article}
                      onMouseEnter={id => {}}
                      onMouseLeave={id => {}}
                      assignArticle={id => {
                        this.assignArticle(id);
                      }}
                    />
                  );
                })
              : null}
          </Card>
        )}
      </Container>
    );
  }
}
export default EditorSignOff;
