import React, {Component} from 'react';
import styled from 'styled-components';
import EurekaSpinner from '../webpack/spinners/EurekaSpinner.js'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2em;
`;

const Title = styled.h1``;

const SubTitle = styled.h3``;

class NoConnection extends Component {
  render() {
    return (
      <Container>
        <Title>Please check your Internet connection.</Title>
        <SubTitle>
          It seems like your are offline. In order to use EUREKA please be sure
          to have a valid Internet connection.
        </SubTitle>
        <EurekaSpinner />
      </Container>
    );
  }
}
export default NoConnection;
