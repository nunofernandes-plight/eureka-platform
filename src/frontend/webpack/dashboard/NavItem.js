import React from 'react';
import styled from 'styled-components';
import Icon from '../icons/Icon.js';
import {
    __GRAY_200,
    __GRAY_300,
    __GRAY_500, __SECOND,
    __THIRD
} from '../../helpers/colors.js';

const Nav = styled.div`
  &:hover {
    background-color: ${props =>
      props.status === 'active' ? null : `${__GRAY_300}`};
    cursor: pointer;
  }

  font-size: 13px;
  font-weight: 500;
  padding: 0.75rem;
  transition: all 0.15s ease;
  color: ${props => (props.status === 'active' ? 'white' : `${__THIRD}`)};
  background: ${props =>
    props.status === 'active' ? `linear-gradient( 150deg, ${__THIRD} 15%, ${__SECOND} 69%, #4caef3 0% )` : 'white'};
  //box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin: 0;
`;

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
    <Nav {...props}>
      <Icon icon={props.icon} {...props} right={10} bottom={3} />
      {props.children}
    </Nav>
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
