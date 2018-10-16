import React from 'react';
import styled from 'styled-components';
import numbro from 'numbro';

const Container = styled.div``;

const formatBalance = balance => {
  return numbro(balance).format({
    thousandSeparated: true,
    mantissa: 2
  });
};

export const Balance = ({balance, ...otherProps}) => {
  return (
    <Container>
      {formatBalance(balance)}
      {otherProps.children}
    </Container>
  );
};
