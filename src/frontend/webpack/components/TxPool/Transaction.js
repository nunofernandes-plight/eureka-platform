import React from 'react';
import styled from 'styled-components';
import {__GRAY_100, __GRAY_300} from '../../../helpers/colors.js';

export const TxLi = styled.li`
  &:hover {
    cursor: pointer;
    background: ${__GRAY_100};
  }
  transition: 0.3s ease-in-out all;
  background: white;
  padding: 2em;
  border-bottom: ${__GRAY_300};
`;

const Transaction = ({tx, ...otherProps}) => {
  return <TxLi key={tx.txHash}>{tx.status}</TxLi>;
};

export default Transaction;
