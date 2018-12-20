import React from 'react';
import styled from 'styled-components';
import TxPool from '../components/TxPool/TxPool.js';
import RenderNetwork from '../../web3/RenderNetwork.js';
import MetaMaskLabel from './MetaMaskLabel.js';
import Avatar from './Avatar.js';
import UserDropDownMenu from './UserDropDownMenu.js';
import {Items} from './UserDropDownItems.js';
import {connect} from 'react-redux';

const Profile = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const DropDownMenuParent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Elements = styled.div`
  display: flex;
  margin-top: 12px;
  align-items: center;
`;

const mapStateToProps = state => ({
  user: state.userData.data
});

const AppHeader = connect(mapStateToProps)(({user, show, ...otherProps}) => {
  return (
    <Profile>
      <Elements>
        <TxPool />
        <RenderNetwork />
        <MetaMaskLabel />
        <DropDownMenuParent
          onMouseEnter={() => otherProps.toggle()}
          onMouseLeave={() => otherProps.toggle()}
        >
          <Avatar
            avatar={user.avatar}
            width={40}
            height={40}
            right={15}
            cursor={'pointer'}
          />
          <UserDropDownMenu
            items={Items}
            top={40}
            right={20}
            visible={show}
            action={item => otherProps.action(item)}
          />
        </DropDownMenuParent>
      </Elements>
    </Profile>
  );
});

export default AppHeader;
