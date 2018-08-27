import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
class ContractOwnerDashboard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <Card width={1000} title={'Contract Owner Dashboard'} />
      </Container>
    );
  }
}

export default ContractOwnerDashboard;
