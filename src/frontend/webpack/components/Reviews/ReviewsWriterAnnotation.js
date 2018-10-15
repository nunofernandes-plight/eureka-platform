import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

class ReviewsWriterAnnotation extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <Container>
        <textarea />
      </Container>
    );
  }
}
export default ReviewsWriterAnnotation;
