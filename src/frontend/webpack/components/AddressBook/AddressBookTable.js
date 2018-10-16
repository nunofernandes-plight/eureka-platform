import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR} from '../../../helpers/colors.js';
import chroma from 'chroma-js';
import AddressBookField from './AddressBookField.js';
import Icon from '../../views/icons/Icon.js';
import {Table} from '../../design-components/Table/Table.js';

const ContactsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  max-height: 400px;
  overflow: scroll;
  padding: 5px 25px;
`;

const NoAddresses = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
`;

const MyLabel = styled.div`
  color: ${props => props.color};
  background: ${props => props.alpha};
  font-size: 10px;
  text-transform: uppercase;
  padding: 1.5px 8px;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  margin: 8px 25px;
`;

const getData = props => {
  let data = [];

  props.contacts.map(c => {
    return data.push({
      address: c.contactAddress,
      preName: getAddressBookField('preName', c, props),
      lastName: getAddressBookField('lastName', c, props),
      labels: getLabels(c),
      icons: getIcons(c, props)
    });
  });

  return data;
};

const getAddressBookField = (field, contact, props) => {
  return (
    <AddressBookField
      contact={contact}
      field={field}
      onChange={(field, address, value) => {
        props.onChange(field, address, value);
      }}
    />
  );
};

const getLabels = contact => {
  if (!contact.label) {
    return <i>No labels.</i>;
  }
  return contact.label.map((l, index) => {
    const alpha = chroma(l.color)
      .alpha(0.1)
      .css();
    return (
      <MyLabel key={index} alpha={alpha} color={l.color}>
        {l.label}
      </MyLabel>
    );
  });
};

const getIcons = (contact, props) => {
  return (
    <div>
      <div>
        <Icon
          icon={'material'}
          material={'edit'}
          bottom={1}
          width={15}
          height={15}
          onClick={() => {
            props.onEdit(contact.contactAddress);
          }}
        />
      </div>
      <div>
        <Icon
          color={__ALERT_ERROR}
          bottom={1}
          icon={'delete'}
          width={13}
          height={13}
          onClick={() => {
            props.onDelete(contact.contactAddress);
          }}
        />
      </div>
    </div>
  );
};
const AddressBookTable = props => {
  return (
    <ContactsContainer>
      {!props.contacts || props.contacts.length === 0 ? (
        <NoAddresses>You don't have any addresses saved yet.</NoAddresses>
      ) : (
        <Table
          textCenter={'Labels'}
          header={['Ethereum Address', 'First Name', 'Last Name', 'Labels', '']}
          columnWidth={['40', '15', '15', '25', '5']}
          data={getData(props)}
        />
      )}
    </ContactsContainer>
  );
};

export default AddressBookTable;
