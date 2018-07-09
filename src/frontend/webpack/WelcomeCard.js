import React from 'react';
import styled from 'styled-components';
import {__THIRD} from '../helpers/colors.js';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  position: absolute;
  bottom: -60px;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  transition: 0.2s ease;
  width: 275px;
  height: 250px;
  color: ${__THIRD};
  margin: 0 10px;
  padding: 15px;
  z-index: 100;
`;

const CardTitle = styled.h2`
  text-transform: uppercase;
`;

const CardFigure = styled.img`
  height: 72px;
  width: auto;
`;

const CardDescription = styled.p``;

const Cards = () => {
  return (
    <Container>
      <Card>
        <CardTitle>Submit your article</CardTitle>
        <CardFigure src="img/icons/submit.png" />
        <CardDescription>Submit your article</CardDescription>
      </Card>
      <Card>
        <CardTitle>Start reviewing</CardTitle>
        <CardFigure src="img/icons/become_reviewer.png" />
        <CardDescription>
          In few steps join the Eureka ecosystem and become a reviewer.
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>(In)Validate a work</CardTitle>
        <CardFigure src="img/icons/validate.png" />
        <CardDescription>
          Validate or invalidate a existing work!
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>Claim your tokens</CardTitle>
        <CardFigure src="img/icons/claim.png" />
        <CardDescription>Claim your tokens in a few step.</CardDescription>
      </Card>
    </Container>
  );
};

export default Cards;
