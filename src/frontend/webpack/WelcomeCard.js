import React from 'react';
import styled from 'styled-components';
import {__THIRD} from '../helpers/colors.js';

const Container = styled.div`
    display: flex;
    position: absolute;
    bottom: -90px;
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
  max-width: 275px;
  height: 250px;
  color: ${__THIRD};
  margin: 0 40px;
  padding: 15px;
  z-index: 100;
`;

const CardTitle = styled.h2``;

const CardFigure = styled.div``;

const CardDescription = styled.p``;

const Cards = () => {
  return (
    <Container>
      <Card>
        <CardTitle>Get a Reviewer</CardTitle>
        <CardFigure>figure</CardFigure>
        <CardDescription>
          as0fokasfkoasokfkoasfkoaskofakosfkoasfkoasfkoasof
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>Get a Reviewer</CardTitle>
        <CardFigure>figure</CardFigure>
        <CardDescription>
          as0fokasfkoasokfkoasfkoaskofakosfkoasfkoasfkoasof
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>Get a Reviewer</CardTitle>
        <CardFigure>figure</CardFigure>
        <CardDescription>
          as0fokasfkoasokfkoasfkoaskofakosfkoasfkoasfkoasof
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>Get a Reviewer</CardTitle>
        <CardFigure>figure</CardFigure>
        <CardDescription>
          as0fokasfkoasokfkoasfkoaskofakosfkoasfkoasfkoasof
        </CardDescription>
      </Card>
    </Container>
  );
};

export default Cards;
