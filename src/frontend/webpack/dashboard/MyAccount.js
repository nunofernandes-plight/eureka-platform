import React from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import {__MAIN, __SECOND, __THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const TopContainer = styled.div`
  min-height: 270px;
  background: linear-gradient(
    150deg,
    ${__THIRD} 15%,
    ${__SECOND} 70%,
    ${__MAIN} 94%
  );
`;

const CardContainer = Row.extend`
  transition: all 0.15s ease;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: black;
  background-clip: border-box;
  min-height: 300px;
  min-width: 800px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  margin-top: -130px !important;
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
