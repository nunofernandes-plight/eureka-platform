import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {renderField} from '../components/Articles/Online/TextEditor/DocumentRenderer.mjs';

const Title = styled.div`
  font-weight: bold;
`;

export const ArticleTitle = ({article, noLink, ...otherProps}) => {
  if (noLink)
    return (
      <Title>{article.title.blocks[0].text}</Title>
    );
  else
    return (
      <Link to={`/app/preview/${article._id}`}>
        <Title>{article.title.blocks[0].text}</Title>
      </Link>
    );
};
