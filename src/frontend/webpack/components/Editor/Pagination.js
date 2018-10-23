import React from 'react';
import styled from 'styled-components';
import {__FIFTH, __GRAY_300, __GRAY_600} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';

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

const PrevButton = props => {
  if (props.currentPage !== 1) {
    return (
      <Element
        number={props.currentPage}
        goToPage={number => {
          const prev = number - 1;
          if (prev >= 1) {
            props.goToPage(prev);
          }
        }}
      >
        <Icon
          icon={'material'}
          material={'keyboard_arrow_left'}
          width={20}
          height={20}
          noMove
        />
      </Element>
    );
  }
  return null;
};

const NextButton = props => {
  if (props.currentPage !== props.totalPages) {
    return (
      <Element
        number={props.currentPage}
        goToPage={number => {
          const next = number + 1;
          if (next <= props.totalPages) {
            props.goToPage(next);
          }
        }}
      >
        <Icon
          icon={'material'}
          material={'keyboard_arrow_right'}
          width={20}
          height={20}
          noMove
        />
      </Element>
    );
  }
  return null;
};

const Page = ({index, currentPage, totalPages, ...otherProps}) => {
  return (
    <Element
      currentPage={currentPage}
      key={index}
      number={index}
      goToPage={number => {
        otherProps.goToPage(number);
      }}
    >
      {index}
    </Element>
  );
};

const Dots = ({index, currentPage, ...otherProps}) => {
  return (
    <Element
      index={index}
      currentPage={currentPage}
      {...otherProps}
      goToPage={number => {}}
    >
      ...
    </Element>
  );
};

const computePagination = ({currentPage, totalPages, ...otherProps}) => {
  let current = currentPage,
    last = totalPages,
    delta = 1,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);

    l = i;
  }

  return renderRangeWithDots({
    currentPage,
    totalPages,
    rangeWithDots,
    ...otherProps
  });
};

const renderRangeWithDots = ({
  currentPage,
  totalPages,
  rangeWithDots,
  ...otherProps
}) => {
  return rangeWithDots.map((item, i) => {
    if (item === '...') {
      return (
        <Dots
          key={i + 1}
          currentPage={currentPage}
          totalPages={totalPages}
          {...otherProps}
        />
      );
    }
    return (
      <Page
        key={i + 1}
        index={item}
        currentPage={currentPage}
        totalPages={totalPages}
        {...otherProps}
      />
    );
  });
};

const Pagination = ({currentPage, totalPages, limit, ...otherProps}) => {
  return (
    <Container>
      <PrevButton
        currentPage={currentPage}
        {...otherProps}
        goToPage={page => {
          otherProps.goToPage(page);
        }}
      />
      {computePagination({currentPage, totalPages, ...otherProps})}
      <NextButton
        totalPages={totalPages}
        currentPage={currentPage}
        {...otherProps}
        goToPage={page => {
          otherProps.goToPage(page);
        }}
      />
    </Container>
  );
};

export default Pagination;
