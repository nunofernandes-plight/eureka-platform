import React from 'react';
import styled from 'styled-components';
const Container = styled.div`
  background: red;
  padding-bottom: 2em;
`;

export const BottomContainer = props => {
  return <Container>{props.children}</Container>;
};
