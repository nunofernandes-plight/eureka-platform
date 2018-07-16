import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../helpers/layout.js';
import EurekaLogo from './icons/EurekaLogo.js';
import {__ALERT_SUCCESS, __THIRD} from '../helpers/colors.js';
import Icon from './icons/Icon.js';
import MetaMaskLogo from './icons/MetaMaskLogo.js';
import {Switch} from 'react-router';
import Web3Providers from '../web3/Web3Providers.js';

const Parent = styled.div`
  box-shadow: -21.213px 21.213px 30px 0px rgba(158, 158, 158, 0.3);
  width: 100%;
  position: fixed;
  background: white;
  z-index: 100;
`;
const Container = Row.extend`
  transition: all 150ms ease;
  color: ${__THIRD};
  cursor: pointer;
  font-size: 18px;
  padding: 25px;
  align-items: center;
  justify-content: space-between;
`;
const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MiddleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
`;

const Item = styled.div`
  margin: 0 10px;
  align-self: center;
`;

const MetaMask = Item.extend`
  display: flex;
  align-items: center;
  font-size: 13px;

  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 10px;
  padding-right: 4px;
  border-radius: 6px;
`;

const NoMetaMask = MetaMask.extend`
  background: #2f3292;
  color: white;
`;

const MetaMaskDetected = MetaMask.extend`
  background: ${__ALERT_SUCCESS};
  color: white;
`;
const SignUp = Item.extend`
  border: 1px solid ${__THIRD};
  padding: 8px 12px;
  border-radius: 4px;
`;

const renderLeft = () => {
  return (
    <LeftContainer>
      <EurekaLogo height={44} blue />
    </LeftContainer>
  );
};

const renderMiddle = props => {
  return (
    <MiddleContainer>
      <Item>
        Products <Icon icon="chevron-down" width={15} height={15} />
      </Item>
      {props.provider === Web3Providers.META_MASK ? (
        <MetaMaskDetected>
          MetaMask detected{' '}
          <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
        </MetaMaskDetected>
      ) : (
        <NoMetaMask>
          Get MetaMask{' '}
          <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
        </NoMetaMask>
      )}
    </MiddleContainer>
  );
};

const renderRight = () => {
  return (
    <RightContainer>
      <Item>Login</Item>
      <SignUp>Sign Up</SignUp>
    </RightContainer>
  );
};

class Header extends Component {
  render() {
    return (
      <Parent>
        <Container>
          {renderLeft(this.props)}
          {renderMiddle(this.props)}
          {renderRight(this.props)}
        </Container>
      </Parent>
    );
  }
}

export default Header;
