import React from 'react';
import styled from 'styled-components';
import Author from '../../views/Author.js';
import {
  makeFieldReadable,
  renderField
} from '../TextEditor/DocumentRenderer.mjs';
import {__GRAY_200, __GRAY_300} from '../../../helpers/colors.js';
import {Figure} from '../../views/Figure.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const FigureContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 24px;
  border-bottom: 1px solid ${__GRAY_300};
  padding-bottom: 0.875rem;
  font-family: 'Roboto', sans-serif;
`;

const getTitleByField = field => {
  const readable = makeFieldReadable(field);
  return <Title>{readable}</Title>;
};

const PreviewArticle = ({document, ...otherProps}) => {
  const props = otherProps;
  const figures = renderField(document, 'figure');
  console.log(figures);
  return (
    <Container>
      <FigureContainer>
        {getTitleByField('figure')}
        {figures.map(src => {
          return <Figure src={src} maxWidth={500} />;
        })}
      </FigureContainer>
    </Container>
  );
};

export default PreviewArticle;
