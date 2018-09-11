import React from 'react';
import styled from 'styled-components';
import {getNetworkBase} from '../../web3/getNetworkBase.js';

const Container = styled.div`
  display: flex;
`;

const TxHash = props => {
  const network = props.network;
  const link = `${getNetworkBase(network)}/tx/${props.txHash}`;

  return (
    <Container>
      <a href="">
        <i>{props.children}</i>
      </a>
    </Container>
  );
};

export default TxHash;
