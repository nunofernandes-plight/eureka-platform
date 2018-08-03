import React from 'react';
import styled from 'styled-components';
import Icon from '../webpack/icons/Icon.js';
import {
  __GRAY_200,
  __GRAY_300,
  __THIRD
} from '../helpers/colors.js';

const Nav = styled.div`
  &:hover {
    background-color: ${props =>
      props.status === 'active' ? null : `${__GRAY_300}`};
    cursor: pointer;
  }

  font-size: 16px;
  font-weight: 500;
  padding: 1.3rem;
  transition: all 0.15s ease;
  color: ${props => (props.status === 'active' ? 'white' : `${__THIRD}`)};
  background-color: ${props =>
    props.status === 'active' ? `${__THIRD}` : 'white'};
  //box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin: 0;
  border-radius: 0.5rem;
`;

const SeparatorDiv = styled.div`
  display: flex;
  height: 2px;
  background: ${__GRAY_200};
  width: 100%;
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
  return <SeparatorDiv>{props.separator}</SeparatorDiv>;
};
