import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const Address = styled.div`
  font-weight: bold;
`;

export const EthereumAddress = ({ethereumAddress, ...otherProps}) => {
  let content = otherProps.content;
  if (!content) content = ethereumAddress;
  return (
    <Link to={`/app/users/${ethereumAddress}`}>
      <Address>{content}</Address>
    </Link>
  );
};
