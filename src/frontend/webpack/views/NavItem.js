import React from 'react';
import styled from 'styled-components';
import Icon from './icons/Icon.js';
import {
  __GRAY_200,
  __GRAY_300,
  __GRAY_500,
  __SECOND,
  __THIRD
} from '../../helpers/colors.js';
import {NavLink} from 'react-router-dom';

const MyNavLink = styled(NavLink)`
  &:hover {
  background-color: ${__GRAY_300}
    cursor: pointer;
  }
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
  display: flex;
  align-items: center;
  margin-left: 14px;
  margin-right: 14px;
  margin-top: 30px;
  margin-bottom: 5px;
  min-height: 15px;
`;

export const NavItem = props => {
  return (
    <MyNavLink {...props} to={`${props.base}/${props.path}`}>
      <Icon
        material={props.material}
        icon={props.icon}
        {...props}
        right={8}
        bottom={4}
      />
      {props.children}
    </MyNavLink>
  );
};

export const Separator = props => {
  return (
    <SeparatorContainer>
      <SeparatorDiv width={35} />
      <SeparatorText>{props.text}</SeparatorText>
      <SeparatorDiv width={100} />
    </SeparatorContainer>
  );
};
