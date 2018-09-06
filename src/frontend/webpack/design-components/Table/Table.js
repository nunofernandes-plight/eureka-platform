import React from 'react';
import styled from 'styled-components';
import {TableHeader} from './TableHeader.js';
import {TableBody} from './TableBody.js';

const TableWrapper = styled.div`
  width: ${props => props.width}px;
`;

const TableContainer = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.15);
  position: relative;
  padding-top: 60px;
  background-color: #fff;
`;

export const MyTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Table = props => {
  return (
    <TableWrapper width={props.width}>
      <TableContainer>
        <TableHeader />
        <TableBody />
      </TableContainer>
    </TableWrapper>
  );
};
