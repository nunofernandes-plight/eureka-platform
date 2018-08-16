import React from 'react';
import ReactSelect from 'react-select';

const Select = props => {
    let {...otherProps} = props;
    return <ReactSelect {...otherProps} />;
};

export default Select;
