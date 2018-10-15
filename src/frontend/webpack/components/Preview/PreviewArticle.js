import React from 'react';
import styled from 'styled-components';
import PreviewArticleFigure from './PreviewArticleFigure.js';
import PreviewArticleAbstract from './PreviewArticleAbstract.js';
import PreviewArticleTitle from './PreviewArticleTitle.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewArticle = ({document, ...otherProps}) => {
  const isReview = otherProps.base
    ? otherProps.base.toString().includes('write/review')
    : false;

  return (
    <Container>
      <PreviewArticleTitle
        isReview={isReview}
        document={document}
        {...otherProps}
      />
      <PreviewArticleAbstract
        isReview={isReview}
        document={document}
        {...otherProps}
      />
      <PreviewArticleFigure
        isReview={isReview}
        document={document}
        {...otherProps}
      />
    </Container>
  );
};

export default PreviewArticle;
