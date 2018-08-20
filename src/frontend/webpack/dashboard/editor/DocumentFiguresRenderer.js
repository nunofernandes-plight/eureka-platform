import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __GRAY_300} from '../../../helpers/colors.js';
import Icon from '../../icons/Icon.js';

const Container = styled.div`
  display: flex;
  flex: ${props => (props.figures ? props.figures.length + ' 1 0%' : null)};
  position: relative;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 12px;
  position: relative;
  border: 1px solid ${__GRAY_300};
  border-radius: 4px;
`;
const FigureContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Figure = styled.img`
  width: 100%;
  height: auto;
`;

const RemoveIconContainer = styled.div`
  margin: 8px 0;
  align-self: center;
`;

const DocumentFiguresRenderer = props => {
  return (
    <Container figures={props.figures}>
      {props.figures.map((figure, i) => {
        return (
          <VerticalContainer key={figure.id}>
            <FigureContainer>
              <Figure src={figure.cdn} />
            </FigureContainer>
            <RemoveIconContainer>
              <Icon
                icon={'delete'}
                color={__ALERT_ERROR}
                width={15}
                height={15}
                onClick={() => {
                  props.onDelete(figure, i);
                }}
              />
            </RemoveIconContainer>
          </VerticalContainer>
        );
      })}
    </Container>
  );
};

export default DocumentFiguresRenderer;
