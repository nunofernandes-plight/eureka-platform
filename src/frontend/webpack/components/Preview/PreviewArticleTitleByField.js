import React from 'react';
import styled from 'styled-components';
import {makeFieldReadable} from '../TextEditor/DocumentRenderer.mjs';
import {__GRAY_300} from '../../../helpers/colors.js';

const Title = styled.h2`
  font-size: 24px;
  border-bottom: 1px solid ${__GRAY_300};
  padding-bottom: 0.875rem;
  font-family: 'Roboto', sans-serif;
`;

export const PreviewArticleTitleByField = ({field}) => {
  return <Title>{makeFieldReadable(field)}</Title>;
};
