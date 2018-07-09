import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../helpers/layout.js';
import {__THIRD} from '../helpers/colors.js';
import EurekaLogo from './icons/EurekaLogo.js';
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

const Title = styled.h1``;

const SubTitle = styled.p``;

const GetStarted = styled.button``;

const Curve = styled.div`
  position: absolute;
  background: #ffffff;
  height: 100px;
  content: '';
  display: block;
  width: 110%;
  bottom: 0px;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
`;

class WelcomePage extends Component {
  render() {
    return (
      <Parent>
        <Container>
          <Wrapper>
            <EurekaLogo white width={500} height={80} />
            {/*<Title>EUREKA PLATFORM ahjas</Title>*/}
            <SubTitle>
              Democratising science through decentralisation and transparency
            </SubTitle>
            <GetStarted>GET STARTED</GetStarted>

          </Wrapper>
            <Cards />
          <Curve />
        </Container>
      </Parent>
    );
  }
}

export default WelcomePage;
