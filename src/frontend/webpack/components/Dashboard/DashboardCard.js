import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __ALERT_WARNING,
  __FIFTH,
  __THIRD
} from '../../../helpers/colors.js';
import DashboardCardTopIcon from './DashboardCardTopIcon.js';

const Container = styled.div`
  flex: 1;
  height: 120px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  padding: 1em;
  background: #fff;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  word-wrap: break-word;
  border-radius: 6px;
  position: relative;
`;

const Title = styled.h2`
  font-weight: bold;
  text-align: center;
  color: ${__ALERT_ERROR};
`;

const getColor = title => {
  if (title === 'Articles') {
    return `linear-gradient(40deg, ${__ALERT_ERROR}, ${__ALERT_WARNING})`;
  }

  if (title === 'Reviews') {
    return `linear-gradient(40deg, ${__THIRD}, ${__FIFTH})`;
  }
};

const DashboardCard = ({stat}) => {
  const color = getColor(stat.title);
  return (
    <Container>
      <DashboardCardTopIcon icon={stat.icon} color={color} />
      <Title>{stat.title}</Title>
    </Container>
  );
};

export default DashboardCard;
