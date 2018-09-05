import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __GRAY_200, __THIRD} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import AddressBookField from './AddressBookField.js';
import chroma from 'chroma-js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const MyLabel = styled.div`
  color: ${props => props.color};
  background: ${props => props.alpha};
  font-size: 10px;
  text-transform: uppercase;
  padding: 1.5px 8px;
  border-radius: 6px;
  font-weight: bold;
  margin: 8px 0;
`;

const Td = styled.td`
  padding: 15px 0;
`;

const AddressBookMyTableRow = props => {
  return (
    <Tr key={props.contact.contactAddress}>
      <Td>{props.contact.contactAddress}</Td>
      <AddressBookField
        contact={props.contact}
        placeholder={'First Name'}
        field={'preName'}
        onChange={(field, address, value) => {
          props.onChange(field, address, value);
        }}
      />
      <AddressBookField
        contact={props.contact}
        placeholder={'Last Name'}
        field={'lastName'}
        onChange={(field, address, value) => {
          props.onChange(field, address, value);
        }}
      />
      <td style={{textAlign: 'center'}}>
        {props.contact.label ? (
          props.contact.label.map((l, index) => {
            const alpha = chroma(l.color)
              .alpha(0.1)
              .css();
            console.log(alpha);
            return (
              <MyLabel key={index} alpha={alpha} color={l.color}>
                {l.label}
              </MyLabel>
            );
          })
        ) : (
          <i>No labels.</i>
        )}
      </td>
      <td style={{textAlign: 'center'}}>
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
