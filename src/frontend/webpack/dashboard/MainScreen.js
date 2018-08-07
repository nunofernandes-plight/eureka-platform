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
      user: null,
      isAuthenticated: false
    };
  }

  componentDidMount() {
    fetch(`${getDomain()}/api/welcome`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        console.log('fetching works');
        if (response.success) {
          this.props.setAuth({authed: true});
          this.setState({
            user: response.data.user,
            isAuthenticated: response.data.isAuthenticated
          });
          console.log(response);
        } else {
          // to be written
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <PanelLeft/>
        <Container>
          <PanelRight>
            <Response> {this.state.isAuthenticated ? this.state.user + ' is logged in' : 'Not logged in!!'}</Response>
          </PanelRight>
        </Container>
      </div>
    );
  }
}

export default MainScreen;
