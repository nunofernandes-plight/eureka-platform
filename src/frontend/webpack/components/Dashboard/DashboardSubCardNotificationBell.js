import React from 'react';
import styled from 'styled-components';
import Icon from '../../views/icons/Icon.js';
import {__ALERT_ERROR, __THIRD} from '../../../helpers/colors.js';

const Container = styled.div`
  position: absolute;
  right: 20px;
  top: -20px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 8px;
  border-radius: 50%;
  position: relative;
`;
const CounterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  border-radius: 50%;
  height: 16px;
  background-color: ${__ALERT_ERROR};
  position: absolute;
  top: 8px;
  border: 1px solid white;
  right: 6px;
`;
const Counter = styled.div`
  font-size: 11px;
`;

const DashboardSubCardNotificationBell = ({color, total}) => {
  return (
    <Container>
      {total > 0 ? (
        <IconContainer color={color}>
          <CounterContainer>
            <Counter>{total}</Counter>
          </CounterContainer>
          <Icon
            icon={'bell'}
            width={'26'}
            height={'26'}
            noMove
            color={__THIRD}
          />
        </IconContainer>
      ) : null}
    </Container>
  );
};

export default DashboardSubCardNotificationBell;
