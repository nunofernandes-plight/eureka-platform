import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';
import PanelLeft from './PanelLeft.js';
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
        <PanelLeft />

        <PanelRight>
            asjajosgoas
          {/*<Container>*/}
          {/*<PanelRight>*/}
          {/*<Response>*/}
          {/*{' '}*/}
          {/*{this.props.isAuthenticated*/}
          {/*? this.props.userAddress + ' is logged in'*/}
          {/*: 'Not logged in!!'}*/}
          {/*</Response>*/}
          {/*</PanelRight>*/}
          {/*</Container>*/}
        </PanelRight>
      </div>
    );
  }
}

export default MainScreen;
