import React from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';
import SC_TRANSACTIONS_TYPE from '../../../../backend/schema/sc-transaction-state-enum.mjs';
import {
  __SCALE_SEVEN,
  __SCALE_ONE,
  __SCALE_TEN,
  __SCALE_THREE,
  __SCALE_TWO
} from '../../../helpers/colors.js';

const getTypeAttributes = type => {
  switch (type) {
    case SC_TRANSACTIONS_TYPE.SUBMIT_ARTICLE:
      return {color: __SCALE_ONE, text: 'ARTICLE SUBMISSION'};

    case SC_TRANSACTIONS_TYPE.EDITOR_ASSIGNED:
      return {color: __SCALE_TWO, text: 'EDITOR ASSIGNMENT'};

    case SC_TRANSACTIONS_TYPE.EDITOR_ARTICLE_ASSIGNMENT:
      return {color: __SCALE_TWO, text: 'ARTICLE ASSIGNED TO YOURSELF'};

    case SC_TRANSACTIONS_TYPE.MINTING:
      return {color: __SCALE_THREE, text: 'MINTING'};

    case SC_TRANSACTIONS_TYPE.EXPERT_REVIEWER_SIGNEDUP:
      return {color: __SCALE_SEVEN, text: 'EXPERT REVIEWER SIGNED UP'};

    default:
      return {color: __SCALE_TEN, text: ''};
  }
};

const Type = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
  padding: ${props => (props.padding ? props.padding : '8px 5px')};
  border-radius: ${props => (props.radius ? props.radius : '10px')};
  font-weight: bold;
  font-size: ${props => (props.size ? props.size + 'px' : 'inherit')};
  margin: 0 20px;
  text-align: center;
`;
const TxType = ({type, ...otherProps}) => {
  const color = getTypeAttributes(type).color;
  return (
    <Type
      {...otherProps}
      color={color}
      background={chroma(color)
        .alpha(0.25)
        .css()}
    >
      {getTypeAttributes(type).text}
    </Type>
  );
};

export default TxType;
