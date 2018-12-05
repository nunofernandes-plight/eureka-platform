import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';

const Parent = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div``;

class ContractOverview extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Parent>
        <Card title={'Smart Contract Overview'}>
          <Container> Implement the contract view here</Container>
        </Card>
      </Parent>
    );
  }
}

export default ContractOverview;
