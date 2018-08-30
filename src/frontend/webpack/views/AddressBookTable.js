import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
  __ALERT_ERROR,
  __GRAY_600,
  __GRAY_200,
  __THIRD,
  __FIFTH, __MAIN
} from '../../helpers/colors.js';
import {renderField} from '../components/editor/DocumentRenderer.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';
import {MEDIUM_DEVICES} from '../../helpers/mobile.js';
import Icon from './icons/Icon.js';

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

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const NoDrafts = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const StartWriting = styled.div`
  &:hover {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    background: ${__FIFTH};
    color: white;
  }
  transition: 0.5s all;
  padding: 0.5rem 1.75rem;
  border-radius: 10px;
  text-align: center;
`;

const MyLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
  color: ${__THIRD};
  transition: 0.25s all;
  text-decoration: none;
`;

const Authors = styled.td`
  ${MEDIUM_DEVICES`
    display: none; 
  `};
`;

const AuthorsTitle = styled.th`
  ${MEDIUM_DEVICES`
    display: none; 
  `};
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
						{props.contacts.map(contact => (
							<Tr key={contact.contactAddress}>
								<td>
									{contact.contactAddress}
								</td>
                <td>
                  {contact.preName}
                </td>
                <td>
                  {contact.lastName}
                </td>
                <td>
                  {contact.info}
                </td>
                <td>
                  <Icon
                    icon={'edit'}
                    width={20}
                    height={20}
                    color={__MAIN}
                    onClick={() => {
                      props.onEdit(contact.contactAddress);
                    }}
                  />
                </td>
								<td>
									<Icon
										icon={'delete'}
										width={20}
										height={20}
										color={__ALERT_ERROR}
										onClick={() => {
											props.onDelete(contact.contactAddress);
										}}
									/>
								</td>
							</Tr>
						))}
					</tbody>
				</Contacts>
			)}
		</ContactsContainer>
	);
};

export default AddressBookTable;
