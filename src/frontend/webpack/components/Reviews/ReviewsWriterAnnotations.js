import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: 0.5s ease-in-out;
  margin-left: ${props => (props.show ? 15 : 0)}px;
`;

const ReviewsWriterAnnotations = props => {
  return <Container {...props}>{props.children}</Container>;
};

export default ReviewsWriterAnnotations;
