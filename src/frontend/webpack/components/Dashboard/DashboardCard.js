import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR} from '../../../helpers/colors.js';

const Container = styled.div`
  flex: 1;
  height: 120px;
  margin: 20px;
     display: flex;
    flex-direction: column;
    padding: 1em
  background: #fff;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  word-wrap: break-word;
  border-radius: 6px;
`;

const Title = styled.h2`
  font-weight: bold;
  margin-top: 0;
  text-align: center;
  color: ${__ALERT_ERROR};
`;
const DashboardCard = ({stat}) => {
  return (
    <Container>
      <Title>{stat.title}</Title>
    </Container>
  );
};

export default DashboardCard;
