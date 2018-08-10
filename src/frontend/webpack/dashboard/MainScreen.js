import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';

import MyAccount from './MyAccount.js';

const Container = styled.div`
  display: flex;
  padding-left: 240px;
`;
const PanelRight = styled.div`
  display: flex;
`;

const PanelLeftFlex = styled.div`
  display: flex;
`;
const Response = styled.div``;

class MainScreen extends Component {
  render() {
    return (
      <div>


        <PanelRight>
          <Container>
            <PanelRight>asjajosgoas</PanelRight>
          </Container>
        </PanelRight>
      </div>
    );
  }
}

export default MainScreen;
