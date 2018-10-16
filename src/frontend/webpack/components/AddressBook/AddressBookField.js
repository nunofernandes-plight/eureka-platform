import React from 'react';

const AddressBookField = props => {
  return <div>{props.contact[props.field]}</div>;
};

export default AddressBookField;
