import React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import Icon from '../../../views/icons/Icon.js';

const MyButton = styled.div`
  &:hover {
    transform: translateY(-2px);
  }
  font-size: 11px;
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  background: ${props => props.background};
  font-style: normal;
  color: white;
  border-radius: 4px;
  padding: 4px 6px;
  width: 100%;
`;

const Container = styled.div`
  margin: 5px 0 0 0;
  display: flex;
`;

const ActionButton = ({title, dataTip, ...otherProps}) => {
  return (
    <Container>
      <MyButton
        data-for={dataTip}
        data-tip={dataTip}
        background={otherProps.background}
        onClick={() => {
          if (otherProps && otherProps.onClick)
            otherProps.onClick();
        }}
      >
        <Icon
          icon={otherProps.icon}
          width={15}
          height={15}
          color={'white'}
          right={4}
        />
        {otherProps.children}
      </MyButton>
      <ReactTooltip place="top" effect="solid" id={dataTip}>
        {title}
      </ReactTooltip>
    </Container>
  );
};

export default ActionButton;
