import React from 'react';
import styled from 'styled-components';
import MyHistoryTableRow from './MyHistoryTableRow.js';
import {Link} from 'react-router-dom';

const ContactsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  max-height: 400px;
  overflow: scroll;
  padding: 5px 25px;
`;

const Contacts = styled.table`
  width: 100%;
  text-align: left;
  position: relative;
  border-collapse: collapse;
  white-space: nowrap;
`;

const TableTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const NoTxs = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const MyHistoryTable = props => {
  return (
    <ContactsContainer>
      {!props.txs || props.txs.length === 0 ? (
        <NoTxs>
          <i>You don't have any transactions registered yet.</i>

          <Link style={{textDecoration: 'none'}} to={'/app/articles/drafts'}>
            <button> Submit your first article now!</button>
          </Link>
        </NoTxs>
      ) : (
        <Contacts>
          <tbody>
            <tr>
              <th>
                <TableTitle>X </TableTitle>
              </th>
              <th>
                <TableTitle>X </TableTitle>
              </th>
              <th>
                <TableTitle>X </TableTitle>
              </th>
              <th>
                <TableTitle>X</TableTitle>
              </th>
              <th />
            </tr>
          </tbody>

          <tbody>{props.txs.map(tx => <MyHistoryTableRow tx={tx} />)}</tbody>
        </Contacts>
      )}
    </ContactsContainer>
  );
};

export default MyHistoryTable;
