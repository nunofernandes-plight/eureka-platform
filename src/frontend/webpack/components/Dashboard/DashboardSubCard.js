import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100px;
  min-width: 50%;
`;

const DashboardSubCard = ({category}) => {
  return <Container>{category.title}</Container>;
};

export default DashboardSubCard;
