import React from 'react';
import styled from 'styled-components';
import {
  __FIFTH,
  __GRAY_200,
  __GRAY_300,
  __GRAY_400,
  __GRAY_500,
  __GRAY_600,
  __GRAY_700,
  __GRAY_800
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {NavLink} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  margin-top: 2em;
`;

const Number = styled.div`
  font-size: 0.875rem;
  display: flex;
  text-decoration: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  margin: 0 3px;
  padding: 0;
  border-radius: 50% !important;
  align-items: center;
  transition: 0.35s ease-in-out;
  justify-content: center;
  color: ${props =>
    props.currentPage === props.number ? 'white' : __GRAY_600};
  background: ${props =>
    props.currentPage === props.number ? __FIFTH : 'transparent'};
  border: 0.0625rem solid
    ${props => (props.currentPage === props.number ? __FIFTH : __GRAY_300)};
`;

const NumberContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Element = ({number, currentPage, ...otherProps}) => {
  const props = otherProps;
  return (
    <NumberContainer
      onClick={() => {
        props.goToPage(number);
      }}
    >
      <Number currentPage={currentPage} number={number}>
        {props.children}
      </Number>
    </NumberContainer>
  );
};

const Pagination = ({currentPage, totalPages, limit, ...otherProps}) => {
  console.log(currentPage);
  return (
    <Container>
      <Element currentPage={currentPage}>
        <Icon
          icon={'material'}
          material={'keyboard_arrow_left'}
          width={20}
          height={20}
          noMove
        />
      </Element>
      {Array(totalPages)
        .fill(true)
        .map((_, i) => {
          return (
            <Element
              currentPage={currentPage}
              key={i}
              number={i}
              goToPage={number => {
                otherProps.goToPage(number);
              }}
            >
              {i}
            </Element>
          );
        })}
      <Element currentPage={currentPage}>
        <Icon
          icon={'material'}
          material={'keyboard_arrow_right'}
          width={20}
          height={20}
          noMove
        />
      </Element>
    </Container>
  );
};

export default Pagination;
