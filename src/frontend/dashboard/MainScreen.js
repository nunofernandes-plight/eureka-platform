import React, {Component} from 'react';
import styled from 'styled-components';
import PanelLeft from './PanelLeft.js';

const Container = styled.div`
  display: flex;
`;

class MainScreen extends Component {
  componentDidMount() {}
  render() {
    return (
      <Container>
        <PanelLeft />
      </Container>
    );
  }
}

export default MainScreen;
