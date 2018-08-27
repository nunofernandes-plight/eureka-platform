import React from 'react';
import ReactSelect from 'react-select';

const Select = props => {
	const {...otherProps} = props;
	return <ReactSelect {...otherProps} />;
};

export default Select;
