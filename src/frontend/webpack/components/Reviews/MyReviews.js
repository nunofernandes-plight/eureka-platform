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

class MyReviews extends React.Component {
  render() {
    return (
      <Container>
        <Card width={1000} title={'My Reviews'}>
          <Table width={700}/>
        </Card>
      </Container>
    );
  }
}

export default MyReviews;
