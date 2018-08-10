import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';

const Container = styled.div`
  display: flex;
  color: blue; 
`;

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Container>
          <div>This is the test for the dasboard componet! enjyo</div>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
