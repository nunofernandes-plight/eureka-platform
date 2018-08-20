import React, {Component} from 'react';
import styled from 'styled-components';

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
