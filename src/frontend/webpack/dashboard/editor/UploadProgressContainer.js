import React from 'react';
import styled from 'styled-components';
import GridSpinner from '../../../webpack/spinners/GridSpinner.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-bottom: 36px;
`;

const Bar = styled.div`
  width: 100px;
  background: rgba(0, 0, 0, 0.1);
  height: 5px;
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
`;

const Fill = styled.div`
  width: ${props => props.progress}px;
  background: ${props => props.theme.mainColor};
  height: 100%;
`;

const UploadProgressContainer = props => {
  return (
    <Container>
      <div style={{display: 'block', alignSelf: 'center'}}>
        <GridSpinner style={{marginTop: 0}} />
        <Bar>
          <Fill progress={props.progress} />
        </Bar>
      </div>
    </Container>
  );
};

export default UploadProgressContainer;
