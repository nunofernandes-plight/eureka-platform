import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR} from '../../helpers/colors.js';
import {EXTRA_LARGE_DEVICES} from '../../helpers/mobile.js';

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: ${__ALERT_ERROR} !important;
  margin-bottom: 0 !important;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  align-items: center;
  padding: 1.5em;
  min-height: 200px;
  width: ${props => (props.width ? props.width + 'px' : null)};

  ${EXTRA_LARGE_DEVICES`
    width: 768px; 
  `};
`;

export const Card = props => {
  return (
    <CardContainer {...props}>
      {props.title ? <CardTitle>{props.title}</CardTitle> : null}
      {props.children}
    </CardContainer>
  );
};
