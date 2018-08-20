import React from 'react';
import styled from 'styled-components';
import {__GRAY_200} from '../../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex: ${props => (props.figures ? props.figures.length + ' 1 0%' : null)};
  position: relative;
  align-items: center;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 12px;
`;
const FigureContainer = styled.div`
  height: 100%;
`;

const Figure = styled.img`
  width: 100%;
  height: auto;
  border: 1px solid ${__GRAY_200};
`;

const DocumentFiguresRenderer = props => {
  return (
    <Container figures={props.figures}>
      {props.figures.map((figure, i) => {
        return (
          <VerticalContainer>
            <FigureContainer key={i}>
              <Figure src={figure.cdn} />
            </FigureContainer>
          </VerticalContainer>
        );
      })}
    </Container>
  );
};

export default DocumentFiguresRenderer;
