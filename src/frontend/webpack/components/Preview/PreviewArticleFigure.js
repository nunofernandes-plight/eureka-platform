import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Figure} from '../../views/Figure.js';
import {
  makeFieldReadable,
  renderField
} from '../TextEditor/DocumentRenderer.mjs';
import {__GRAY_300} from '../../../helpers/colors.js';

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
  return makeFieldReadable(field);
};

const PreviewArticleFigure = ({document}) => {
  const figures = renderField(document, 'figure');
  return (
    <FigureContainer>
      <Title>{getTitleByField('figure')}</Title>
      {figures.length === 0 ? (
        <i>No figure.</i>
      ) : (
        <Fragment>
          {figures.map(src => {
            return <Figure src={src} maxWidth={500} />;
          })}
        </Fragment>
      )}
    </FigureContainer>
  );
};
export default PreviewArticleFigure;
