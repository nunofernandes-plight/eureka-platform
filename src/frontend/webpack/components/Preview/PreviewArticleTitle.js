import React, {Fragment} from 'react';
import styled from 'styled-components';
import {renderField} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import ReviewsWriterContainer from '../Reviews/Annotations/WriterContainer.js';
import {ReviewsWriterFieldContainer} from '../Reviews/Annotations/ReviewsWriterField.js';

const Container = styled.div``;
const Title = styled.h3`
  font-size: 26px;
  font-weight: bold;
  line-height: 1.3;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 10px;
  flex: 3;
  margin-top: 0;
`;

const PreviewArticleTitle = ({document, isReview, ...otherProps}) => {
  const field = 'title';
  return (
    <Container id={field}>
      <ReviewsWriterFieldContainer>
        {isReview ? (
          <Fragment>
            <Title>{renderField(document, field)}</Title>
            <ReviewsWriterContainer
              field={field}
              {...otherProps}
              onClick={() => {
                alert('sküüüü');
              }}
            />
          </Fragment>
        ) : null}
      </ReviewsWriterFieldContainer>
    </Container>
  );
};
export default PreviewArticleTitle;
