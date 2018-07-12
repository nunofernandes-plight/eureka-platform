import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import {Link} from 'react-router-dom';
import {__THIRD} from '../../helpers/colors.js';
import EurekaLogo from '../icons/EurekaLogo.js';
import Cards from './WelcomeCard.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${__THIRD};
  min-height: 620px;
  position: relative;
`;

const Wrapper = Row.extend`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 7em;
`;
const SubTitle = styled.p``;

const GetStarted = styled.button``;

const Curve = styled.div`
  position: absolute;
  background: #ffffff;
  height: 100px;
  content: '';
  display: block;
  width: 100%;
  bottom: 0px;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
`;

const Footer = styled.div`
  background: white;
  width: 100%;
  min-height: 120px;
  margin-top: 5em;
`;

class WelcomePage extends Component {
  render() {
    return (
      <Parent>
        <Container>
          <Wrapper>
            <EurekaLogo white width={500} height={80} />
            <SubTitle>
              Democratising science through decentralisation and transparency
            </SubTitle>
            <Link to="/login">
              <button>GET STARTED</button>
            </Link>
          </Wrapper>
          <Cards />
          <Curve />
        </Container>
        <Footer />
      </Parent>
    );
  }
}

export default WelcomePage;