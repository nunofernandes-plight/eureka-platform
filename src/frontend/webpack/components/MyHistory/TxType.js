import React from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';
import SC_TRANSACTIONS_TYPE from '../../../../backend/schema/sc-transaction-state-enum.mjs';
import {
  __SCALE_ONE,
  __SCALE_TEN,
  __SCALE_THREE,
  __SCALE_TWO
} from '../../../helpers/colors.js';

const getColor = type => {
  switch (type) {
    case SC_TRANSACTIONS_TYPE.SUBMIT_ARTICLE:
      return __SCALE_ONE;

    case SC_TRANSACTIONS_TYPE.EDITOR_ASSIGNED:
      return __SCALE_TWO;

    case SC_TRANSACTIONS_TYPE.MINTING:
      return __SCALE_THREE;

    default:
      return __SCALE_TEN;
  }
};

const Type = styled.div`
  background: ${props => props.background};
  color: ${props => props.color};
`;
const TxType = type => {
    console.log(type);
  const color = getColor(type);
  return (
    <Type
      color={color}
      background={chroma(color)
        .alpha(0.2)
        .css()}
    >
      12312
    </Type>
  );
};

export default TxType;
