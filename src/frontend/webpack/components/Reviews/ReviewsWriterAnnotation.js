import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 300px;
  height: 200px;
`;

class ReviewsWriterAnnotation extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <Container>
        <textarea />
      </Container>
    );
  }
}
export default ReviewsWriterAnnotation;
