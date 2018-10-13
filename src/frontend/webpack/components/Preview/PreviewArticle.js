import React from 'react';
import styled from 'styled-components';
import PreviewArticleFigure from './PreviewArticleFigure.js';
import PreviewArticleAbstract from './PreviewArticleAbstract.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewArticle = ({document, ...otherProps}) => {
  const isReview = otherProps.base.toString().includes('write/review');

  return (
    <Container>
      <PreviewArticleAbstract isReview={isReview} document={document} />
      <PreviewArticleFigure document={document} isReview={isReview} />
    </Container>
  );
};

export default PreviewArticle;
