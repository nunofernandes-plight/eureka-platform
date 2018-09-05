import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __ALERT_SUCCESS,
  __GRAY_200,
  __GRAY_300,
  __MAIN,
  __THIRD
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {InputField} from '../../design-components/Inputs.js';
import AddressBookField from './AddressBookField.js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const Td = styled.td`
  padding: 15px 0;
`;

const Tick = styled(Icon)`
  opacity: ${props => (props.valid ? '1' : '0.5')};
  pointer-events: ${props => (props.valid ? 'auto' : 'none')};
  background-color: ${props => (props.valid ? __ALERT_SUCCESS : __GRAY_300)};
`;

const AddressBookMyTableRow = props => {
  return (
    <Tr key={props.contact.contactAddress}>
      <Td width={'42%'}>{props.contact.contactAddress}</Td>
      <AddressBookField
        width={'16%'}
        contact={props.contact}
        placeholder={'First Name'}
        field={'preName'}
        onChange={(field, address, value) => {
          props.onChange(field, address, value);
        }}
      />
      <AddressBookField
        width={'16%'}
        contact={props.contact}
        placeholder={'Last Name'}
        field={'lastName'}
        onChange={(field, address, value) => {
          props.onChange(field, address, value);
        }}
      />
      {/*<AddressBookField*/}
        {/*width={'16%'}*/}
        {/*contact={props.contact}*/}
        {/*placeholder={'Comment'}*/}
        {/*field={'info'}*/}
        {/*onChange={(field, address, value) => {*/}
          {/*props.onChange(field, address, value);*/}
        {/*}}*/}
      {/*/>*/}
      <td>
        {props.contact.onEdit ? (
          <Icon
            icon={'save'}
            width={12}
            height={12}
            color={__THIRD}
            onClick={() => {
              props.onSave(props.contact.contactAddress);
            }}
          />
        ) : (
          <Icon
            icon={'edit'}
            width={12}
            height={12}
            color={__THIRD}
            onClick={() => {
              props.onEdit(props.contact.contactAddress);
            }}
          />
        )}
      </td>
      <td>
        <Icon
          icon={'delete'}
          width={12}
          height={12}
          color={__ALERT_ERROR}
          onClick={() => {
            props.onDelete(props.contact.contactAddress);
          }}
        />
      </td>
    </Tr>
  );
};

export default AddressBookMyTableRow;
