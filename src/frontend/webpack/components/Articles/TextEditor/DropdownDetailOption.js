import React from 'react';
import styled from 'styled-components';

const Title = styled.div`
  margin-bottom: 6px;
`;
const Subtitle = styled.div`
  color: gray;
  font-size: 0.9em;
  margin-top: -2px;
  font-weight: normal;
`;

const DropdownDetailOption = props => {
	return (
		<div style={props.style}>
			<Title>{props.title}</Title>
			<Subtitle>{props.subtitle}</Subtitle>
		</div>
	);
};

export default DropdownDetailOption;
