import React, {Component} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

class MainScreen extends Component {
  render() {
    return (
      <Container>
        <h1>Welcome user!</h1>
      </Container>
    );
  }
}

export default MainScreen;
