import React from 'react';
import styled from 'styled-components';
import Roles from '../../../backend/schema/roles-enum.mjs';
import chroma from 'chroma-js';
import {getScale} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  color: ${props => props.color};
  background: ${props => props.background};
  padding: 4px 7px;
  border-radius: 4px;
  text-align: center;
  align-items: center;
  margin: 5px 10px;
  justify-content: center;
`;

const getColor = role => {
  switch (role) {
    case Roles.AUTHOR:
      return getScale()[0];
    case Roles.REVIEWER:
      return getScale()[2];
    case Roles.CONTRACT_OWNER:
      return getScale()[3];
    case Roles.EDITOR:
      return getScale()[4];

    default:
      return getScale()[getScale().length - 1];
  }
};

const removeSpecialCharacters = str => {
  return str
    .toString()
    .replace(/[^\w\s]/gi, '')
    .toString()
    .replace('_', ' ');
};

export const Role = ({role}) => {
  const color = getColor(role);
  const background = chroma(color)
    .alpha(0.25)
    .css();

  return (
    <Container color={color} background={background}>
      {removeSpecialCharacters(role)}
    </Container>
  );
};
