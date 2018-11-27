import React from 'react';
import styled from 'styled-components';

const Parent = styled.div`
  display: flex;
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${props =>
    props.show ? 'rgba(99, 114, 130, 0.5)' : 'transparent'};
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  transition: 0.35s all ease-in-out;
`;

const PoolModal = ({show, ...otherProps}) => {
  return <Parent show={show}>{otherProps.children}</Parent>;
};

export default PoolModal;
