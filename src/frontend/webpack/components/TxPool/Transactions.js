import React from 'react';
import styled from 'styled-components';
import {__GRAY_200, __GRAY_300} from '../../../helpers/colors.js';

const Container = styled.ol`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const TxLi = styled.li`
  &:hover {
    cursor: pointer;
    background: ${__GRAY_200};
  }
  transition: 0.3s ease-in-out all;
  background: white;
  padding: 2em;
  border-bottom: ${__GRAY_300};
`;

const getData = () => {
  return [
    {txHash: 12412412},
    {txHash: 1241241},
    {txHash: 1412},
    {txHash: 12412}
  ];
};

const Transactions = () => {
  return (
    <Container>
      {getData().map(tx => {
        return <TxLi key={tx.txHash}>{tx.txHash}</TxLi>;
      })}
    </Container>
  );
};

export default Transactions;
