import React, {Fragment} from 'react';
import styled from 'styled-components';
import {InputField} from '../design-components/Inputs.js';
import {getDomain} from '../../../helpers/getDomain.mjs';
import {
  __ALERT_ERROR,
  __GRAY_100,
  __GRAY_200,
  __GRAY_300
} from '../../helpers/colors.js';
import Icon from '../views/icons/Icon.js';
import queryString from 'query-string';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  min-height: 150px;
`;

const Searchable = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 0;
  border: 1px solid ${__GRAY_100};
  max-height: 180px;
  overflow: scroll;
`;

const Article = styled.li`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.3s all;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const ArticlesSection = styled.div`
  border: 1px solid ${__GRAY_100};
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  padding: 12px;
  font-weight: normal;
`;

const Listed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Element = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const TopContainer = styled.div`
  background: ${__GRAY_300};
`;

const Delete = styled.div``;

const SearchSection = styled.div``;

class ArticlesSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingArticles: false,
      articles: null
    };
  }

  handleInput(query) {
    this.setState({loadingArticles: true});
    if (!query) {
      this.setState({
        articles: null,
        loadingArticles: false
      });
      return;
    }
    const myQueryString = queryString.stringify({
      title: query
    });

    fetch(`${getDomain()}/api/articles?`+
      `page=1&limit=15&${myQueryString}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({
            articles: response.data.array
          });
        }
        this.setState({loadingArticles: false});
      })
      .catch(err => {
        console.error(err);
        this.setState({loadingArticles: false});
      });
  }

  renderArticle(article) {
    const listed = this.props.listedArticles;
    if (listed) {
      const articleIds = listed.map(a => {
        return a._id;
      });
      // look if the selected user of the searchable list has been already inserted in the listed user
      const isAlreadyListed = articleIds.includes(article._id);

      if (!isAlreadyListed) {
        return this.getArticlesToRender(article);
      }

    } else {
      return this.getArticlesToRender(article);
    }
  }

  getArticlesToRender(article) {
    return (
      <Article
        key={article._id}
        onClick={() => {
          this.props.addToList(article);
        }}
      >
        {article.title.blocks[0].text}
      </Article>
    );
  }

  renderDeleteButton(a) {
    return (
      <Delete>
        <Icon
          icon={'delete'}
          width={15}
          height={15}
          color={__ALERT_ERROR}
          right={20}
          onClick={() => {
            this.props.deleteFromList(a);
          }}
        />
      </Delete>
    );
  }

  render() {
    return (
      <Container>
        <ArticlesSection>
          <TopContainer>
            <Title>{this.props.listedTitle}</Title>
          </TopContainer>
          <Listed>
            {this.props.listedArticles
              ? this.props.listedArticles.map(a => {
                  return (
                    <Element key={a._id}>
                      {a.title.blocks[0].text}
                      {this.renderDeleteButton(a)}
                    </Element>
                  );
                })
              : null}
          </Listed>
        </ArticlesSection>

        <SearchSection>
          <h4 style={{textAlign: 'left', marginBottom: 0}}>Search by title</h4>
          <p style={{fontSize: 10, textAlign: 'left', marginTop: 0}}>
            You can find all submitted articles.{' '}
          </p>
          <InputField
            placeholder={`Search for an article`}
            onChange={e => this.handleInput(e.target.value)}
          />
          {!this.state.articles ? null : (
            <Searchable>
              {this.state.articles.map((article) => {
                return <Fragment key={article._id}>{this.renderArticle(article)}</Fragment>;
              })}
            </Searchable>
          )}
        </SearchSection>
      </Container>
    );
  }
}

export default ArticlesSelection;
