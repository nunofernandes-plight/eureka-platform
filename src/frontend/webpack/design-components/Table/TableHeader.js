import React from 'react';
import styled from 'styled-components';
import {__FIFTH} from '../../../helpers/colors.js';
import {MyTable} from "./Table.js";
import {TableRow} from "./TableRow.js";

const MyTableHeader = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;


const TableHeaderCell = styled.th`
  &:first-child {
    padding-left: 40px;
  }
  font-size: 16px;
  padding-top: 18px;
  padding-bottom: 18px;
  color: #fff;
  line-height: 1.4;
  background-color: ${__FIFTH};
`;

export const TableHeader = props => {
  return (
    <MyTableHeader>
      <MyTable>
        <thead>
          <TableRow>
            <TableHeaderCell>First column</TableHeaderCell>
            <TableHeaderCell>Second column</TableHeaderCell>
            <TableHeaderCell>Third column</TableHeaderCell>
          </TableRow>
        </thead>
      </MyTable>
    </MyTableHeader>
  );
};
