import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR} from '../../helpers/colors.js';

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: ${__ALERT_ERROR} !important;
  margin-bottom: 0 !important;
`;

export const CardTitle = props => {
  return <Title>{props.children}</Title>;
};
