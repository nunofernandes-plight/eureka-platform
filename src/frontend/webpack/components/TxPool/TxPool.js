import React from 'react';
import styled, {keyframes} from 'styled-components';
import {transparentize} from 'polished';

const animation = keyframes`
	from {
		transform: scale(0);
		opacity: 1;
	}
	to {
		transform: scale(3);
		opacity: 0.0;
	}
`;

const TxPoolContainer = styled.div`
  padding: 6px;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background: #4770b0;
  box-shadow: 0 1px 6px rgb(23, 196, 208), 0 1px 3px rgb(45, 233, 170);
`;

const Pulsing = styled.div`
  border: 1px solid ${transparentize(0.8, 'rgb(23, 196, 208)')};
  width: 20px;
  height: 20px;
  top: 8px;
  left: 7px;
  border-radius: 50%;
  background: radial-gradient(
    rgb(23, 196, 208),
    ${transparentize(0.8, 'rgb(45, 233, 170)')}
  );
  animation: ${animation} 3s infinite;
  position: absolute;
`;
const TxPoolIcon = styled.img`
  width: 22px;
  height: 20px;
`;

const Container = styled.div`
  position: relative;
  margin: 0 15px;
  height: 35px;
  width: 35px;
`;

class TxPool extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <TxPoolContainer>
          <TxPoolIcon src="/img/tx/transaction.svg" />
        </TxPoolContainer>{' '}
        <Pulsing />
      </Container>
    );
  }
}

export default TxPool;
