import React, {Component} from 'react';
import styled from 'styled-components';
import {Link, withRouter} from 'react-router-dom';
import EurekaLogo from '../views/icons/EurekaLogo.js';
import {NavItem, Separator} from '../views/NavItem.js';
import {Routes} from './routers/Routes.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 180px;
  height: 100%;
  left: 0;
  top: 30px;
  z-index: 600;
  background: white;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  transition-property: width;
  flex: 1 1 auto;
  overflow-x: hidden;
`;

const TopLogo = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationBell = styled.div`
  position: absolute;
  border-radius: 50%;
  background: red;
  margin-left: 14px;
  width: 18px;
  height: 18px;
`;

const NotificationNumber = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  margin-top: -2.3px;
`;

class PanelLeft extends Component {
  constructor() {
    super();
    this.state = {
      activePath: PanelLeft.computeActiveRoute()
    };
  }

  static computeActiveRoute() {
    const pathArray = window.location.href.toString().split('app');
    const path = pathArray[pathArray.length - 1]; // e.g. /account
    return path.replace(/[^a-zA-Z ]/g, '');
  }

  render() {
    return (
      <Container>
        <TopLogo>
          <NotificationBell>
            <NotificationNumber>1</NotificationNumber>
          </NotificationBell>
          <EurekaLogo height={40} />
        </TopLogo>
        <Items>
          {Routes.map((route, i) => {
            return (
              <NavItem
                material={route.material}
                path={route.path}
                base={this.props.base}
                icon={route.icon}
                width={20}
                height={20}
              >
                {route.name}
              </NavItem>
            );
          })}
        </Items>
      </Container>
    );
  }
}

export default withRouter(PanelLeft);
