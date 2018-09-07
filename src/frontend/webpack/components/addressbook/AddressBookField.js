import React from 'react';
import {InputField} from '../../design-components/Inputs.js';

const AddressBookField = props => {
  return <div>{props.contact[props.field]}</div>;
};

export default AddressBookField;
