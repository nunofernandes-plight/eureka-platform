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
  constructor() {
    super();
    this.state = {
      response: null
    };
  }
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <PanelLeft />
        <Container>
          <PanelRight>
            {' '}
            {this.state.response ? (
              <Response>Is User authenticated ? {this.state.response}</Response>
            ) : null}
          </PanelRight>
        </Container>
      </div>
    );
  }
}

export default MainScreen;
