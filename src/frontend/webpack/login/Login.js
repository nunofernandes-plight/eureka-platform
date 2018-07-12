import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import {__FOURTH, __MAIN, __SECOND, __THIRD} from '../../helpers/colors.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  color: ${__THIRD};
  margin-top: 2em;
  text-align: center;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  width: 420px;
`;

const Button = styled.button`
  background: -webkit-linear-gradient(0deg, ${__THIRD} 0%, ${__FOURTH} 100%);
`;

const MetaMaskDisclaimer = styled.div``;

const Paragraph = styled.p`
  width: 300px;
  word-break: break-word;
`;

const TitleRow = Row.extend`
  flex-direction: column;
`;
const LoginRow = styled.div``;
class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <TitleRow>
          <Title>Please login</Title>
          <MetaMaskDisclaimer>
            <Paragraph>
              Our application requires MetaMask as authentication provider.
              Please note that we are not able neither to see nor to store your
              private keys.{' '}
            </Paragraph>
          </MetaMaskDisclaimer>
        </TitleRow>
        <Row>
          <LoginContainer>
            <LoginRow>
              <input type="text" required />
              <label>Email address</label>
            </LoginRow>
            <LoginRow>
              <Button>
                Sign in with Metamask <MetaMaskLogo width={20} height={20} />
              </Button>
            </LoginRow>
          </LoginContainer>
        </Row>
      </Container>
    );
  }
}

export default Login;
