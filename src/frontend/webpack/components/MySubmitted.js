import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';

const Container = styled.div``;

class MySubmitted extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <Card width={800} title={'My Submitted Documents'} />
      </Container>
    );
  }
}

export default MySubmitted;
