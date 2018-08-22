import React from 'react';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import Icon from './icons/Icon.js';
import {__FIFTH} from '../../helpers/colors.js';

const MyLink = styled(NavLink)`
  &:hover {
    transform: translateY(2px);
  }
  transition: 0.25s all;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  color: ${__FIFTH};
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin: 0 10px;
  border-radius: 10px;
  cursor: pointer;

  &.${props => props.activeClassName} {
    background-color: ${__FIFTH};
    color: #fff;
  }
`;

MyLink.defaultProps = {
  activeClassName: 'active'
};
const IconContainer = styled.div`
  width: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavPill = props => {
  return (
    <MyLink to={`${props.base}/${props.path}`}>
      <IconContainer {...props}>
        {props.name}
        <Icon
          noMove
          left={5}
          icon={props.icon}
          material={props.material}
          width={props.width}
          height={props.height}
        />
      </IconContainer>
    </MyLink>
  );
};

export default NavPill;
