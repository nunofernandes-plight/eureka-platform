import React from 'react';
import styled from 'styled-components';

const MyTableRow = styled.tr``;

export const TableRow = props => {
  return <MyTableRow>{props.children}</MyTableRow>;
};
