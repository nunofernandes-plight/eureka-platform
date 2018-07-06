import React, {Component} from 'react';
import styled from 'styled-components';
import EurekaLogo from './Icons/EurekaLogo.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

class WelcomePage extends Component {
  render() {
    return <Container />;
  }
}

export default WelcomePage;
