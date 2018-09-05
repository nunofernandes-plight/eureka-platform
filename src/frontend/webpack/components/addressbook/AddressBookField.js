import React from 'react';
import {InputField} from "../../design-components/Inputs.js";

const AddressBookField = props => {
  if (!props.contact.onEdit) {
    return <td width={props.width}>{props.contact[props.field]}</td>;
  }
  return (
    <td>
      <InputField
        type={'text'}
        value={props.contact[props.field]}
        placeholder={props.placeholder}
        onChange={e => {
          props.onChange(
            props.field,
            props.contact.contactAddress,
            e.target.value
          );
        }}
      />
    </td>
  );
};

export default AddressBookField;
