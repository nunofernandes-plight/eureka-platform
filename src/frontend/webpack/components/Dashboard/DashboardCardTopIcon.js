import React from 'react';
import styled from 'styled-components';
import Icon from '../../views/icons/Icon.js';

const Container = styled.div`
  background: ${props => props.color};
  position: absolute;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);

  right: 20px;
  top: -20px;
  border-radius: 6px;
  padding: 0.5rem;
`;

const DashboardCardTopIcon = ({icon, color}) => {
  return (
    <Container color={color}>
      <Icon icon={icon} width={30} height={30} color={'#fff'} />
    </Container>
  );
};

export default DashboardCardTopIcon;
