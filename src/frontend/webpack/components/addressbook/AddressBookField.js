import React from 'react';
import {InputField} from "../../design-components/Inputs.js";

const AddressBookField = props => {
  if (!props.contact.onEdit) {
    return <td width={props.width}>{props.contact[props.field]}</td>;
  }
};

export default AddressBookField;
