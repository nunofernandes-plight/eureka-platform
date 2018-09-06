import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_DANGER,
  __ALERT_ERROR,
  __ALERT_WARNING,
  __GRAY_200,
  __THIRD
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import AddressBookField from './AddressBookField.js';
import chroma from 'chroma-js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
  border-bottom: 1px solid ${__GRAY_200};
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

const Icons = styled.td`
  text-align: center;
  padding-left: 8px;
  border-left: 1px solid ${__GRAY_200};
`;

const Labels = styled.td`
  text-align: center;
  padding-right: 8px;
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
      <Labels>
        {props.contact.label ? (
          props.contact.label.map((l, index) => {
            const alpha = chroma(l.color)
              .alpha(0.1)
              .css();
            return (
              <MyLabel key={index} alpha={alpha} color={l.color}>
                {l.label}
              </MyLabel>
            );
          })
        ) : (
          <i>No labels.</i>
        )}
      </Labels>
      <Icons>
        <div>
          <Icon
            icon={'material'}
            material={'edit'}
            bottom={1}
            width={15}
            height={15}
            onClick={() => {
              props.onEdit(props.contact.contactAddress);
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
              props.onDelete(props.contact.contactAddress);
            }}
          />
        </div>
      </Icons>
    </Tr>
  );
};

export default AddressBookMyTableRow;
