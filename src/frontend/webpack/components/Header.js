import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import EurekaLogo from '../views/icons/EurekaLogo.js';
import {__THIRD} from '../../helpers/colors.js';
import Icon from '../views/icons/Icon.js';
import RenderNetwork from '../../web3/RenderNetwork.js';
import Avatar from '../views/Avatar.js';
import CircleSpinner from '../views/spinners/CircleSpinner.js';
import MetaMaskLabel from '../views/MetaMaskLabel.js';

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

const SignUp = Item.extend`
  &:hover {
    border: 1px solid ${__THIRD};
    background: ${__THIRD};
    color: white;
  }
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid ${__THIRD};
  padding: 8px 12px;
  border-radius: 4px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const renderLeft = props => {
  const isApp = props.user && props.isAuthenticated;
  return (
    <LeftContainer>
      {isApp ? (
        <EurekaLogo app height={44} blue />
      ) : (
        <EurekaLogo height={44} blue />
      )}
    </LeftContainer>
  );
};

const renderStatus = props => {
  if (!props.metaMaskStatus || !props.network) {
    return <CircleSpinner />;
  }
  return (
    <Flex>
      <MetaMaskLabel {...props} />
      <RenderNetwork network={props.network} />
    </Flex>
  );
};

const renderMiddle = props => {
  return (
    <MiddleContainer>
      <Item>
        Products <Icon icon="chevron-down" width={15} height={15} />
      </Item>
      {renderStatus(props)}
    </MiddleContainer>
  );
};

const renderRight = props => {
  if (props.isAuthenticated && props.user) {
    return (
      <ProfileContainer>
        <div>
          <Avatar avatar={props.user.avatar} width={40} height={40} />
        </div>
        {/* <Email>{renderEmail(props)}</Email> */}
      </ProfileContainer>
    );
  }
  return (
    <RightContainer>
      <Item style={{cursor: 'pointer'}}>
        {' '}
        <a style={{textDecoration: 'none'}} href="/login">
          Login
        </a>
      </Item>
      <SignUp>
        <a style={{textDecoration: 'none'}} href="/signup">
          Sign Up
        </a>
      </SignUp>
    </RightContainer>
  );
};

// Do not show the header when the user is authenticated (i.e. is in the main app)
class Header extends Component {
  render() {
    return (
      <div>
        {this.props.isAuthenticated ? null : (
          <Parent>
            <Container {...this.props}>
              {renderLeft(this.props)}
              {renderMiddle(this.props)}
              {renderRight(this.props)}
            </Container>
          </Parent>
        )}
      </div>
    );
  }
}

export default Header;
