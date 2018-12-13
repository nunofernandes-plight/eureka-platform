import React from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import EurekaLogo from './icons/EurekaLogo.js';
import {__THIRD} from '../../helpers/colors.js';
import Icon from './icons/Icon.js';
import RenderNetwork from '../../web3/RenderNetwork.js';
import Avatar from './Avatar.js';
import CircleSpinner from './spinners/CircleSpinner.js';
import MetaMaskLabel from './MetaMaskLabel.js';
import {connect} from 'react-redux';
import {fetchUserData} from '../reducers/user.js';

const Parent = styled.div`
  box-shadow: -21.213px 21.213px 30px 0px rgba(158, 158, 158, 0.3);
  width: 100%;
  position: fixed;
  background: white;
  z-index: 100;
`;
const Container = styled(Row)`
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

const SignUp = styled(Item)`
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

const renderLeft = ({user, isAuthenticated}) => {
  const isApp = user && isAuthenticated;
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

const renderStatus = ({metaMaskStatus, network}) => {
  if (!metaMaskStatus || !network) {
    return <CircleSpinner />;
  }
  return (
    <Flex>
      <MetaMaskLabel metaMaskStatus={metaMaskStatus} />
      <RenderNetwork network={network} />
    </Flex>
  );
};

const renderMiddle = ({metaMaskStatus, network}) => {
  return (
    <MiddleContainer>
      <Item>
        Products <Icon icon="chevron-down" width={15} height={15} />
      </Item>
      {renderStatus({metaMaskStatus, network})}
    </MiddleContainer>
  );
};

const renderRight = ({isAuthenticated, user}) => {
  if (isAuthenticated && user) {
    return (
      <ProfileContainer>
        <div>
          <Avatar avatar={user.avatar} width={40} height={40} />
        </div>
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
const mapDispatchToProps = dispatch => ({
  fetchUserData: () => {
    dispatch(fetchUserData());
  }
});
const mapStateToProps = state => ({
  isAuthenticated: state.userData.isAuthenticated,
  user: state.userData.data,
  network: state.networkData.network,
  metaMaskStatus: state.metamaskData.status
});

export const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(({provider, metaMaskStatus, network, isAuthenticated, user}) => {
  return (
    <div>
      {isAuthenticated ? null : (
        <Parent>
          <Container>
            {renderLeft({user, isAuthenticated})}
            {renderMiddle({metaMaskStatus, network})}
            {renderRight({isAuthenticated, user})}
          </Container>
        </Parent>
      )}
    </div>
  );
});
