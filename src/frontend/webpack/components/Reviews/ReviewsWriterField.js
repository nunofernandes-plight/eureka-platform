import React from 'react';
import styled from 'styled-components';
import {__GRAY_200} from '../../../helpers/colors.js';

const Field = styled.div`
  display: flex;
  line-height: 1.5;
`;

export const FieldContainer = styled.div`
  flex: 4;
`;

export const ReviewContainer = styled.div`
  flex: 1;
  margin-left: 15px;
  padding-left: 15px;
  border-left: 1px solid ${__GRAY_200};
`;

export const ReviewsWriterFieldContainer = props => {
  return <Field>{props.children}</Field>;
};
