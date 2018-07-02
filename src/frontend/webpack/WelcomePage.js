import React, {Component} from 'react';
import styled from 'styled-components';
import EurekaLogo from "./Icons/EurekaLogo.js";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const BigTitle = styled.h1`
  font-size: 5vw;
  text-transform: uppercase;
`;
class WelcomePage extends Component {
  render() {
    return (
      <Container>
        <BigTitle>Eureka Platform</BigTitle>
        <EurekaLogo width="180"/>
      </Container>
    );
  }
}

export default WelcomePage;
