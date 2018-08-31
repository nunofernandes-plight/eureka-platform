import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
  __ALERT_ERROR,
  __GRAY_600,
  __GRAY_200,
  __THIRD,
  __FIFTH, __MAIN, __ALERT_SUCCESS
} from '../../../helpers/colors.js';
import {renderField} from '../editor/DocumentRenderer.js';
import {renderTimestamp} from '../../../helpers/timestampRenderer.js';
import {MEDIUM_DEVICES} from '../../../helpers/mobile.js';
import Icon from '../../views/icons/Icon.js';
import {InputField} from '../../design-components/Inputs.js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const AddressBookTableRow = props => {
  if (props.editable)
    return (
      <Tr key={props.contact.contactAddress}>
        <td>
          {props.contact.contactAddress}
        </td>
        <td>
          <InputField
            value={props.contact.preName}
            placeholder={'First Name'}
            onChange={(e) =>{props.onChange}}
          />
        </td>
        <td>
          <InputField
            value={props.contact.lastName}
            placeholder={'Last Name'}
          />
        </td>
        <td>
          <InputField
            value={props.contact.info}
            placeholder={'Last Name'}
          />
        </td>
        <td>
          <Icon
            icon={'check'}
            width={20}
            height={20}
            color={__ALERT_SUCCESS}
            onClick={() => {
              props.onSave(this.state.newContact);
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
              props.onDelete(props.contact.contactAddress);
            }}
          />
        </td>
      </Tr>
    );
  else
    return (
      <Tr key={props.contact.contactAddress}>
        <td>
          {props.contact.contactAddress}
        </td>
        <td>
          {props.contact.preName}
        </td>
        <td>
          {props.contact.lastName}
        </td>
        <td>
          {props.contact.info}
        </td>
        <td>
          <Icon
            icon={'edit'}
            width={20}
            height={20}
            color={__MAIN}
            onClick={() => {
              props.onEdit(props.contact.contactAddress);
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
              props.onDelete(props.contact.contactAddress);
            }}
          />
        </td>
      </Tr>
    );
};

export default AddressBookTableRow;
