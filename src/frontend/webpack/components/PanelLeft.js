import React, {Component} from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import EurekaLogo from '../views/icons/EurekaLogo.js';
import {NavItem, Separator} from '../views/NavItem.js';
import {MAKE_MOBILE} from '../../helpers/mobile.js';
import {
  PANEL_LEFT_BREAK_POINT,
  PANEL_LEFT_MOBILE_WIDTH,
  PANEL_LEFT_NORMAL_WIDTH
} from '../../helpers/layout.js';
import ToggleButton from '../design-components/ToggleButton.js';
import {Routes} from './Routers/Routes.js';
import connect from 'react-redux/es/connect/connect.js';
import {__THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: ${props =>
    props.isMobileMode ? PANEL_LEFT_MOBILE_WIDTH : PANEL_LEFT_NORMAL_WIDTH}px;
  left: 0;
  padding-top: 30px;
  z-index: 600;
  background: white;
  transition: 0.3s all;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  transition-property: width;
  flex: 1 1 auto;
  overflow-x: hidden;
  max-height: 100%;

  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    width: ${PANEL_LEFT_MOBILE_WIDTH}px;  
  `};
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

const MobileMode = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60px;
  background: white;
  width: 100%;
  z-index: 10;
  margin-top: 30px;
  margin-bottom: 5px;

  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    display: none;`};
`;

const MobileModeTitle = styled.h5`
  margin: 0;
  text-align: center;
`;
class PanelLeft extends Component {
  render() {
    return (
      <Container isMobileMode={this.props.checked}>
        <TopLogo>
          <NotificationBell>
            <NotificationNumber>4</NotificationNumber>
          </NotificationBell>
          <EurekaLogo height={40} />
        </TopLogo>
        <Items>
          {Routes.map((route, i) => {
            return (
              <div key={i}>
                {route.separator &&
                this.props.user.roles.includes(route.role) ? (
                  <Separator
                    isMobileMode={this.props.checked}
                    text={route.separator}
                  />
                ) : null}
                {this.props.user.roles.includes(route.role) ? (
                  <NavItem
                    color={__THIRD}
                    key={i}
                    material={route.material}
                    path={route.path}
                    base={this.props.base}
                    icon={route.icon}
                    width={20}
                    height={20}
                    isMobileMode={this.props.checked}
                  >
                    {route.name}
                  </NavItem>
                ) : null}
              </div>
            );
          })}

          <MobileMode>
            <MobileModeTitle>Toggle menu</MobileModeTitle>
            <ToggleButton
              checked={this.props.checked}
              onChange={isMobileMode => {
                this.props.isMobileMode(isMobileMode);
              }}
            />
          </MobileMode>
        </Items>{' '}
      </Container>
    );
  }
}

export default withRouter(
  connect(state => ({user: state.userData.data}))(PanelLeft)
);
