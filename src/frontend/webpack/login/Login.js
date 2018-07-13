import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import {__FOURTH, __THIRD} from '../../helpers/colors.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';
import EurekaLogo from '../icons/EurekaLogo.js';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Title = styled.h1`
  color: ${__THIRD};
  margin-top: 2em;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  width: 600px;
  position: relative;
  z-index: 10;
`;

const Button = styled.button`
  background: -webkit-linear-gradient(0deg, ${__THIRD} 0%, ${__FOURTH} 100%);
  align-self: center;
`;

const MetaMaskDisclaimer = styled.div``;

const Paragraph = styled.p`
  word-break: break-word;
  text-align: center;
  width: 600px;
  margin-bottom: 40px;
  background: ${__THIRD};
  border-radius: 10px;
  color: white;
  padding: 20px;
  box-shadow: 0 2.213px 15px 0px rgb(51, 46, 46);
`;

const TitleRow = Row.extend`
  flex-direction: column;
`;
const LoginRow = styled.div`
  margin: 10px 0;
`;

const ButtonRow = styled.div`
  align-self: center;
  margin: 15px 0;
`;

const SignUp = styled.p``;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.05;
  filter: alpha(opacity=0.05); /* For IE8 and earlier */
`;

const MetaMaskInstalled = styled.div`

`

const SubTitle = styled.h2``;
class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <MetaMaskInstalled>
        </MetaMaskInstalled>
        <TitleRow>
          <Title>
            Welcome to{' '}
            <div style={{marginLeft: 10}}>
              <EurekaLogo blueNoLogo width={200} />
            </div>
          </Title>

          <MetaMaskDisclaimer>
            <Paragraph>
              Our application requires MetaMask<MetaMaskLogo
                width={15}
                height={15}
              />as authentication provider. Please note that we are not able
              neither to see nor to store your private keys.{' '}
            </Paragraph>
          </MetaMaskDisclaimer>
        </TitleRow>
        <SubTitle>Please login</SubTitle>
        <Row>
          <LoginContainer>
            <Background>
              <EurekaLogo width={400} height={400} />
            </Background>
            <LoginRow>
              <input type="text" required />
              <label>Username</label>
            </LoginRow>
            <LoginRow>
              <input type="text" required />
              <label>Email address</label>
            </LoginRow>
            <ButtonRow>
              <Button>
                Login with Metamask <MetaMaskLogo width={20} height={20} />
              </Button>
            </ButtonRow>
          </LoginContainer>
        </Row>
        <Row>
          <SignUp>
            Do not have <strong>Metamask</strong>? Please{' '}
            <Link to="/metamask">See here.</Link>
          </SignUp>
        </Row>
      </Container>
    );
  }
}

export default Login;
