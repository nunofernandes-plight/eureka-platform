import React from 'react';
import styled from 'styled-components';
import UploadSpinner from '../../../../views/spinners/UploadSpinner.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-bottom: 36px;
`;

const UploadProgressContainer = () => {
	return (
		<Container>
			<div style={{display: 'block', alignSelf: 'center'}}>
				<UploadSpinner style={{marginTop: 0}} />
			</div>
		</Container>
	);
};

export default UploadProgressContainer;
