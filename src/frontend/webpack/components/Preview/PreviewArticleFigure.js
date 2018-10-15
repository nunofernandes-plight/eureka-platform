import React from 'react';
import styled from 'styled-components';
import {Figure} from '../../views/Figure.js';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';

const Container = styled.div``;

const Figures = ({figures}) => {
  if (figures.length === 0) {
    return <i>No figure.</i>;
  }
  return figures.map(src => {
    return <Figure key={src} src={src} maxWidth={500} />;
  });
};

const PreviewArticleFigure = ({document}) => {
  const figures = renderField(document, 'figure');
  return (
    <Container id={'figure'}>
      <PreviewArticleTitleByField field={'figure'} />
      <Figures figures={figures} />
    </Container>
  );
};
export default PreviewArticleFigure;
