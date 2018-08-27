import React from 'react';
import styled from 'styled-components';
import {__ALERT_WARNING, __FIFTH, __MAIN, __THIRD} from '../helpers/colors.js';
import Icon from '../webpack/views/icons/Icon.js';
import Network from './Network.js';

const NetworkContainer = styled.div`
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  font-size: 13px;
  padding: 8px 10px;
  background: ${props => getColor(props.network)};
  border-radius: 6px;
  color: ${props =>
    props.network === Network.GANACHE ? `${__THIRD}` : 'white'};
`;

const GanacheLogo = styled.img`
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
`;

const getColor = network => {
  switch (network) {
    case Network.ROPSTEN:
      return `${__ALERT_WARNING}`;

    case Network.MAIN:
      return `${__FIFTH}`;

    case Network.GANACHE:
      return `white`;

    case Network.UNKNOWN:
      return `${__MAIN}`;

    case Network.KOVAN:
      return `${__THIRD}`;

    default:
      return null;
  }
};

const RenderNetwork = props => {
  return (
    <NetworkContainer network={props.network}>
      {props.network}{' '}
      {props.network === Network.GANACHE ? (
        <GanacheLogo src="/img/logos/ganache.png" />
      ) : (
        <Icon
          icon={'ethereum'}
          width={15}
          height={15}
          color={'white'}
          bottom={3}
        />
      )}
    </NetworkContainer>
  );
};

export default RenderNetwork;
