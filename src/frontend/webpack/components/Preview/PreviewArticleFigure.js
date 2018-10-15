import React from 'react';
import styled from 'styled-components';
import {Figure} from '../../views/Figure.js';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';
import {
  FieldContainer,
  ReviewsWriterFieldContainer
} from '../Reviews/ReviewsWriterField.js';
import ReviewsWriterContainer from '../Reviews/ReviewsWriterContainer.js';

const Container = styled.div``;

const Figures = ({figures}) => {
  if (figures.length === 0) {
    return (
      <FieldContainer>
        <i>No figure.</i>
      </FieldContainer>
    );
  }
  return (
    <FieldContainer>
      {figures.map(src => {
        return <Figure key={src} src={src} maxWidth={500} />;
      })}
    </FieldContainer>
  );
};

const PreviewArticleFigure = ({document, isReview}) => {
  const figures = renderField(document, 'figure');
  return (
    <Container id={'figure'}>
      <PreviewArticleTitleByField field={'figure'} />

      <ReviewsWriterFieldContainer>
        <Figures figures={figures} />
        {isReview ? (
          <ReviewsWriterContainer
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          />
        ) : null}
      </ReviewsWriterFieldContainer>
    </Container>
  );
};
export default PreviewArticleFigure;
