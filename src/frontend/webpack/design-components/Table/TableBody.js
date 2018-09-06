import React from 'react';
import styled from 'styled-components';
import {__GRAY_900} from '../../../helpers/colors.js';
import {MyTable} from './Table.js';
import {TableRow} from './TableRow.js';

const MyTableBody = styled.div`
  max-height: 585px;
  overflow: hidden !important;
  touch-action: auto;
  position: relative;
`;

const TableBodyCell = styled.td`
  &:first-child {
    padding-left: 40px;
  }
  font-size: 13px;
  color: ${__GRAY_900};
  line-height: 1.4;
  padding-top: 16px;
  padding-bottom: 16px;
`;

export const TableBody = props => {
  return (
    <MyTableBody>
      <MyTable>
        <tbody>
          <TableRow>
            <TableBodyCell>jfasjsaijf</TableBodyCell>
            <TableBodyCell>fhdfhdfh</TableBodyCell>
            <TableBodyCell>jfasjsahfkjhjklhjgijf</TableBodyCell>
          </TableRow>

          <TableRow>
            <TableBodyCell>jfasjsaijf</TableBodyCell>
            <TableBodyCell>fhdfhdfh</TableBodyCell>
            <TableBodyCell>jfasjsahfkjhjklhjgijf</TableBodyCell>
          </TableRow>

          <TableRow>
            <TableBodyCell>jfasjsaijf</TableBodyCell>
            <TableBodyCell>fhdfhdfh</TableBodyCell>
            <TableBodyCell>jfasjsahfkjhjklhjgijf</TableBodyCell>
          </TableRow>
        </tbody>
      </MyTable>
    </MyTableBody>
  );
};
