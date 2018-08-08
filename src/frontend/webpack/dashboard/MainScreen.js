import React, {Component} from 'react';
import styled from 'styled-components';
import PanelLeft from './PanelLeft.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Cookies from 'js-cookie';

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
        <PanelLeft/>
        <Container>
          <PanelRight>
            <Response> {this.props.isAuthenticated ? this.props.userAddress + ' is logged in' : 'Not logged in!!'}</Response>
          </PanelRight>
        </Container>
      </div>
    );
  }
}

export default MainScreen;
