import React from 'react';
import styled from 'styled-components';

const Ball = styled.span`
  left: ${props => (props.left ? props.left : null)}px;
  right: ${props => (props.right ? props.right : null)}px;
  top: ${props => props.top}px;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  border-radius: 50%;
  position: absolute;
  background: ${props => `rgba(${props.rgb}, ${props.intensity})`};
`;

export default Ball;
