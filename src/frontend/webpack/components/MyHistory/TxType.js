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

    case SC_TRANSACTIONS_TYPE.MINTING:
      return {color: __SCALE_THREE, text: 'MINTING'};

    case SC_TRANSACTIONS_TYPE.EXPERT_REVIEWER_SIGNEDUP:
      return {color: __SCALE_SEVEN, text: 'EXPERT REVIEWER SIGNED UP'};

    default:
      return __SCALE_TEN;
  }
};

const Type = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
  padding: 8px 5px;
  border-radius: 10px;
  font-weight: bold;
  margin: 0 20px;
  text-align: center;
`;
const TxType = props => {
  const color = getTypeAttributes(props.type).color;
  return (
    <Type
      color={color}
      background={chroma(color)
        .alpha(0.25)
        .css()}
    >
      {getTypeAttributes(props.type).text}
    </Type>
  );
};

export default TxType;
