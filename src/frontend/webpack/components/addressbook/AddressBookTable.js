import React from 'react';
import styled from 'styled-components';
import AddressBookMyTableRow from './AddressBookMyTableRow.js';

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

const NoDrafts = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const AddressBookTable = props => {
  return (
    <ContactsContainer>
      {!props.contacts || props.contacts.length === 0 ? (
        <NoDrafts>You don't have any addresses saved yet.</NoDrafts>
      ) : (
        <Contacts>
          <tbody>
            <tr>
              <th>
                <TableTitle>Ethereum address</TableTitle>
              </th>
              <th>
                <TableTitle>First Name</TableTitle>
              </th>
              <th>
                <TableTitle>Last Name</TableTitle>
              </th>
              <th style={{textAlign: 'center'}}>
                <TableTitle>Labels</TableTitle>
              </th>
              <th />
            </tr>
          </tbody>

          <tbody>
            {props.contacts.map(contact => (
              <AddressBookMyTableRow
                key={contact.contactAddress}
                contact={contact}
                onEdit={address => {
                  props.onEdit(address);
                }}
                onDelete={address => {
                  props.onDelete(address);
                }}
                onChange={(field, address, value) => {
                  props.onChange(field, address, value);
                }}
                onSave={address => {
                  props.onSave(address);
                }}
              />
            ))}
          </tbody>
        </Contacts>
      )}
    </ContactsContainer>
  );
};

export default AddressBookTable;
