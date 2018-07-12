import React, {Component} from 'react';
import styled from 'styled-components';
import MetaMaskLogo from './icons/MetaMaskLogo.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h1``;
const SubTitle = styled.h2``;

class MetaMaskGuide extends Component {
  render() {
    return (
      <Container>
        <Title>EUREKA and MetaMask</Title>
        <MetaMaskLogo width={100} height={100} />
        <SubTitle>How does it work</SubTitle>
      </Container>
    );
  }
}

export default MetaMaskGuide;
