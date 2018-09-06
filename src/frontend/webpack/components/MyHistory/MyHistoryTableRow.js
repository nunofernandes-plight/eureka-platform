import React from 'react';
import styled from 'styled-components';
import {__GRAY_200} from '../../../helpers/colors.js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
  border-bottom: 1px solid ${__GRAY_200};
`;

const Td = styled.td`
  padding: 15px 0;
`;

const MyHistoryTableRow = props => {
  return (
    <Tr>
      <Td>asfasf</Td>
      <Td>asfasf</Td>
      <Td>asfasf</Td>
      <Td>asfasf</Td>
    </Tr>
  );
};

export default MyHistoryTableRow;
