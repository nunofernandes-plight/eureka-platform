import React from 'react';
import styled from 'styled-components';
import {getNetworkBase} from '../../web3/getNetworkBase.js';

const Container = styled.div`
  display: flex;
`;

const MyLink = styled.a``;

const TxHash = props => {
  const network = props.network;
  const link = `${getNetworkBase(network)}/tx/${props.txHash}`;

  return (
    <Container>
      <MyLink href={link}>
        <i>{props.children}</i>
      </MyLink>
    </Container>
  );
};

export default TxHash;
