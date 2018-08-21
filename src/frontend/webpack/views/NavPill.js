import React from 'react';
import styled from 'styled-components';
import Icon from './icons/Icon.js';

const Circle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  padding: 1rem;
  transition: all 0.15s ease;
  color: ${props => (props.status === 'active' ? '#fff' : '#5e72e4')};
  background-color: ${props =>
    props.status === 'active' ? '#5e72e4' : '#fff'};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin: 0 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const IconContainer = styled.div`
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavPill = props => {
  return (
    <Circle {...props}>
      <IconContainer {...props}>
        <Icon
          icon={props.icon}
          material={props.material}
          width={props.width}
          height={props.height}
        />
      </IconContainer>
    </Circle>
  );
};

export default NavPill;
