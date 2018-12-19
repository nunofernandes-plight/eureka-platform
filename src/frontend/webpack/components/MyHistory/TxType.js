import React from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';
import SC_TRANSACTIONS_TYPE from '../../../../backend/schema/sc-transaction-state-enum.mjs';
import {
  __SCALE_SEVEN,
  __SCALE_ONE,
  __SCALE_TEN,
  __SCALE_THREE,
  __SCALE_TWO,
  __SCALE_EIGHT
} from '../../../helpers/colors.js';


const Type = styled.div`
  width: 250px;
  background: ${props => props.background};
  color: ${props => props.color};
  padding: ${props => (props.padding ? props.padding : '8px 5px')};
  border-radius: ${props => (props.radius ? props.radius : '10px')};
  font-weight: bold;
  font-size: ${props => (props.size ? props.size + 'px' : 'inherit')};
  margin: ${props => (props.noMargin ? '0' : '0 20px')};
  text-align: center;
`;
const TxType = ({color, text, ...otherProps}) => {
  return (
    <Type
      {...otherProps}
      color={color}
      background={chroma(color)
        .alpha(0.25)
        .css()}
    >
      {text}
    </Type>
  );
};

export default TxType;
