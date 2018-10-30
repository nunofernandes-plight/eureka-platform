import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  padding-left: 25px;
  transition: 0.5s ease-in-out;
  margin-left: ${props => (props.show ? 15 : 0)}px;
  position: relative;
`;

const Annotations = props => {
  return <Container {...props}>{props.children}</Container>;
};

export default Annotations;
