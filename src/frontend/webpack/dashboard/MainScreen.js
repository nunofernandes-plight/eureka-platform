import React, {Component} from 'react';
import styled from 'styled-components';
import PanelLeft from './PanelLeft.js';
import {getDomain} from '../../../helpers/getDomain.js';
import EurekaLogo from '../icons/EurekaLogo.js';

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
    fetch(`${getDomain()}/api/welcome`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
      .then(response => {
        let resp = response.toString();
        console.log(response);
        this.setState({response: resp});
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <PanelLeft />
        <Container>
          <PanelRight>
            {' '}
            {this.state.response ? (
              <Response>{this.state.response}</Response>
            ) : null}
            <div>
              ashifajosfjoasfjoasfjo asfoaosjf ojasfjoasf joasoj fjoasf joasfjo
              a
            </div>
            <EurekaLogo width={40} height={40} />
          </PanelRight>
        </Container>
      </div>
    );
  }
}

export default MainScreen;
