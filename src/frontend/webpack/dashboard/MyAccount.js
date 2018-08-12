import React from 'react';
import styled from 'styled-components';
import {__MAIN, __SECOND, __THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const TopContainer = styled.div`
  min-height: 220px;
  background: linear-gradient(
    150deg,
    ${__THIRD} 15%,
    ${__SECOND} 70%,
    ${__MAIN} 94%
  );
  position: relative;
`;

const CardContainer = styled.div`
  transition: all 0.15s ease;
  position: absolute;
  margin-top: -200px !important;
`;

const Card = styled.div`
  min-width: 800px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: border-box;
`;

class MyAccount extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <TopContainer />
        <CardContainer>
          <Card>asgasga</Card>
        </CardContainer>
      </Container>
    );
  }
}

export default MyAccount;
