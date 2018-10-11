import React from 'react';
import styled from 'styled-components';
import PreviewArticleFigure from './PreviewArticleFigure.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewArticle = ({document, ...otherProps}) => {
  return (
    <Container>
      <PreviewArticleFigure document={document} />
    </Container>
  );
};

export default PreviewArticle;
