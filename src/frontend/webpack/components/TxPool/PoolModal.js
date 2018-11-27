import React, {Fragment} from 'react';
import styled, {keyframes} from 'styled-components';
import {PANEL_LEFT_NORMAL_WIDTH} from '../../../helpers/layout.js';

const Parent = styled.div`
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(99, 114, 130, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const modalFade = keyframes`
 from {transform: translateY(-70%);opacity: 0;}
  to {transform: translateY(0);opacity: 1;}
`;

const MyModal = styled.div`
  margin-left: ${PANEL_LEFT_NORMAL_WIDTH / 2}px;
  height: 300px;
  display: flex;
  -ms-flex-direction: column;
  position: fixed;
  animation: ${modalFade};
  animation-duration: 0.5s;
  transition: 0.3s linear ease-in-out;
  max-width: 100%;
  max-height: 100%;
  z-index: 12;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(99, 114, 130, 0.16),
    0 8px 16px rgba(27, 39, 51, 0.08);
  background-clip: padding-box;
  width: 560px;
`;

const PoolModal = ({show, ...otherProps}) => {
  return (
    <Fragment>
      {show ? (
        <Parent>
          <MyModal>{otherProps.children}</MyModal>
        </Parent>
      ) : null}
    </Fragment>
  );
};

export default PoolModal;
