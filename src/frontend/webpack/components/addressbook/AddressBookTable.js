import React from 'react';
import styled from 'styled-components';
import AddressBookTableRow from './AddressBookTableRow.js';

const ContactsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  padding: 10px 25px;
  max-height: 400px;
  overflow: scroll;
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
				<NoDrafts>
					You don't have any addresses saved yet.
				</NoDrafts>
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
							<th>
								<TableTitle>Comment</TableTitle>
							</th>
							<th />
						</tr>
					</tbody>

					<tbody>
						{props.contacts.map( (contact) => (
							<AddressBookTableRow
								contact={contact}
								editable={props.contactToEdit === contact.contactAddress}
								onEdit={props.onEdit}
								onDelete={props.onDelete}
								onSave={props.onSave}/>
						))}
					</tbody>
				</Contacts>
			)}
		</ContactsContainer>
	);
};

export default AddressBookTable;
