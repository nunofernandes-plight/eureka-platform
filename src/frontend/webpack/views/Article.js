import React from 'react';
import ArticleCard from './ArticleCard.js';

const Article = ({article, ...otherProps}) => {
  return (
    <ArticleCard
      assignArticle={id => {
        otherProps.assignArticle(id);
      }}
      onHover={otherProps.onHover}
      onMouseEnter={id => {
        otherProps.onMouseEnter(id);
      }}
      onMouseLeave={id => {
        otherProps.onMouseLeave(id);
      }}
      article={article}
    />
  );
};

export default Article;
