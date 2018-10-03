import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const Address = styled.div``;

export const EthereumAddress = ({ethereumAddress, ...otherProps}) => {
  // TODO insert a address lookup in our app
  return (
    <Link to={`/app/users/${ethereumAddress}`}>
      <Address>{ethereumAddress}</Address>
    </Link>
  );
};
