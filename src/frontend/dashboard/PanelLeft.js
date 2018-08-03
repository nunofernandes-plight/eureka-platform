import React, {Component} from 'react';
import styled from 'styled-components';
import {__GRAY_100, __GRAY_200} from '../helpers/colors.js';
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
  margin: 10px 0;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

class PanelLeft extends Component {
  //  Dashboard / Submitted articles / My reviews / My linked articles / Wallet /  History /
  render() {
    return (
      <Container>
        <TopLogo>
          <EurekaLogo blue height={40} />
        </TopLogo>
        <Items>
          <Separator text={'General'} />
          <NavItem status="active" icon={'bell'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>
          <NavItem icon={'bell'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>
          <NavItem icon={'bell'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>

          <Separator text={'Wallet'} />
          <NavItem icon={'bell'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>
          <NavItem icon={'bell'} width={20} height={20}>
            {' '}
            Dashboard
          </NavItem>
        </Items>
      </Container>
    );
  }
}

export default PanelLeft;
