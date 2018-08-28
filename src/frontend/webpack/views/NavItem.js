import React from 'react';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {
  __GRAY_200,
  __GRAY_300,
  __GRAY_500,
  __SECOND,
  __THIRD
} from '../../helpers/colors.js';
import {MAKE_MOBILE} from '../../helpers/mobile.js';
import {PANEL_LEFT_BREAK_POINT} from '../../helpers/layout.js';
import Icon from './icons/Icon.js';

const MyNavLink = styled(NavLink)`
  &:hover {
  background-color: ${__GRAY_300}
    cursor: pointer;
  }
  display: flex;
  font-size: 13px;
  font-weight: 500;
  padding: 0.75rem;
  transition: all 0.25s ease;
  color: ${__THIRD};
  background: #fff;
  margin: 0;
  text-decoration: none;
  &.${props => props.activeClassName} {
    color: #fff;
    background: linear-gradient(
      150deg,
      ${__THIRD} 15%,
      ${__SECOND} 69%,
      #4caef3 0%
    );
  }
  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    justify-content: center; 
`};
`;

MyNavLink.defaultProps = {
  activeClassName: 'active'
};

const SeparatorDiv = styled.div`
  display: flex;
  height: 2px;
  width: ${props => props.width}px;
  background: ${__GRAY_200};
  //width: 100%;
`;

const SeparatorText = styled.div`
  color: ${__GRAY_500}
  font-size: 16px;
  text-transform: uppercase !important;
  font-weight: bold;
  margin: 0 10px;
`;

const SeparatorContainer = styled.div`
  display: ${props => (props.isMobileMode ? 'none' : 'flex')};
  align-items: center;
  margin-left: 14px;
  margin-right: 14px;
  margin-top: 15px;
  margin-bottom: 5px;
  min-height: 15px;

  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    display: none;`};
`;

const LinkName = styled.div`
  display: ${props => (props.isMobileMode ? 'none' : null)};
  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    display: none;`};
`;

const IconContainer = styled.div`
  display: flex;
  width: ${props => (props.isMobileMode ? '100%' : 'auto')};
  justify-content: ${props => (props.isMobileMode ? 'center' : 'flex-start')};
`;

export const NavItem = props => {
  return (
    <MyNavLink to={`${props.base}/${props.path}`}>
      <IconContainer {...props}>
        <Icon
          material={props.material}
          icon={props.icon}
          {...props}
          right={8}
          bottom={4}
        />
      </IconContainer>
      <LinkName isMobileMode={props.isMobileMode}>{props.children}</LinkName>
    </MyNavLink>
  );
};

export const Separator = props => {
  return (
    <SeparatorContainer {...props}>
      <SeparatorDiv width={35} />
      <SeparatorText>{props.text}</SeparatorText>
      <SeparatorDiv width={100} />
    </SeparatorContainer>
  );
};
