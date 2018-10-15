import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import AuthorLookup from '../AuthorLookup.js';

const Container = styled.div`
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: none;
`;

const AnnotationHeader = styled.div`
  display: flex;
`;

class ReviewsWriterAnnotation extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    const annotation = this.props.annotation;
    return (
      <Container>
        <AnnotationHeader>
          <AuthorLookup
            addresses={annotation.owner}
            right={5}
            width={23}
            height={23}
            noAddress
            padding={'5px'}
          />
        </AnnotationHeader>
        <AnnotationBody>{annotation.text}</AnnotationBody>
      </Container>
    );
  }
}
export default ReviewsWriterAnnotation;
