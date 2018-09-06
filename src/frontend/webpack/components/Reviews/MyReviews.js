import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {Table} from '../../design-components/Table/Table.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SContainer = styled.div`
  font-weight: bold;
`;
class MyReviews extends React.Component {
  state = {
    data: [
      {
        firstName: <SContainer>OJjoOJJOojASF</SContainer>,
        lastName: 'pelloni',
        role: 'Client Developer'
      },
      {firstName: 'sevi', lastName: 'wulli', role: 'SC Developer'},
      {firstName: 'andi', lastName: 'schaufel', role: 'Backend Developer'},
      {firstName: 'andi', lastName: 'schaufel', role: 'Backend Developer'},
      {firstName: 'andi', lastName: 'schaufel', role: 'Backend Developer'}
    ]
  };
  render() {
    return (
      <Container>
        <Card width={1000} title={'My Reviews'}>
          <Table
            data={this.state.data}
            columnWidth={['33.3', '33.3', '33.3']}
            header={['First', 'Second', 'Third']}
          />
        </Card>
      </Container>
    );
  }
}

export default MyReviews;
