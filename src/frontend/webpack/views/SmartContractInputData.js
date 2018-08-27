import React from 'react';
import styled from 'styled-components';

const SmartContractInputData = props => {
	return (
		<div>
			<ul>
				<li>Hash: {props.inputData.hash}</li>
				<li>Authors: {props.inputData.authors}</li>
				<li>Url: {props.inputData.url}</li>
			</ul>
		</div>
	);
};

export default SmartContractInputData;
