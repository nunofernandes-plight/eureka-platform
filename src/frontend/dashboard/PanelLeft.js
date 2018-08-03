import React, {Component} from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __GRAY_100, __GRAY_200} from '../helpers/colors.js';
import EurekaLogo from '../webpack/icons/EurekaLogo.js';
import {NavItem, Separator} from './NavItem.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 240px;
  height: 100%;
  left: 0;
  top: 135px;
  z-index: 600;
  background: white;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  transition-property: width;
  flex: 1 1 auto;
  border-right: 1px solid ${__GRAY_200};
`;

const TopLogo = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationBell = styled.div`
  position: absolute;

  border-radius: 50%;
  background: red; 
  margin-left: 8px;

  width: 20px;
  height: 20px;
`;

class PanelLeft extends Component {
  //  Dashboard / Submitted articles / My reviews / My linked articles / Wallet /  History /
  render() {
    return (
      <Container>
        <TopLogo>
          <NotificationBell />
          <EurekaLogo height={40} />
        </TopLogo>
        <Items>
          <Separator text={'General'} />
          <NavItem status="active" icon={'dashboard'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>
          <NavItem icon={'article'} width={20} height={20}>
            {' '}
            My Articles
          </NavItem>
          <NavItem icon={'review'} width={20} height={20}>
            {' '}
            My Reviews
          </NavItem>

          <NavItem icon={'link'} width={20} height={20}>
            {' '}
            My linked Articles
          </NavItem>

          <Separator text={'Personal'} />
          <NavItem icon={'wallet'} width={20} height={20}>
            {' '}
            My Wallet
          </NavItem>
          <NavItem icon={'account'} width={20} height={20}>
            {' '}
            My Account
          </NavItem>

          <Separator text={'History'} />
          <NavItem icon={'ethereum'} width={20} height={20}>
            {' '}
            My Actions
          </NavItem>
        </Items>
      </Container>
    );
  }
}

export default PanelLeft;
