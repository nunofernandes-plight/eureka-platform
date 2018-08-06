import React, {Component} from 'react';
import styled from 'styled-components';
import {
  __ALERT_WARNING,
  __GRAY_100,
  __MAIN,
  __SECOND,
  __THIRD
} from '../helpers/colors.js';
import Network from '../web3/Network.js';
import Icon from '../webpack/icons/Icon.js';

const NetworkContainer = styled.div`
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  font-size: 13px;
  padding: 6px 10px;
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
      return `${__THIRD}`;

    case Network.MAIN:
      return `${__SECOND}`;

    case Network.GANACHE:
      return `white`;

    case Network.UNKNOWN:
      return `${__MAIN}`;

    default:
      return null;
  }
};

class RenderNetwork extends Component {
  render() {
    return (
      <NetworkContainer network={this.props.network}>
        {this.props.network}{' '}
        {this.props.network === Network.GANACHE ? (
          <GanacheLogo src="img/logos/ganache.png" />
        ) : (
          <Icon icon={'internet'} width={15} height={15} color={'white'} />
        )}
      </NetworkContainer>
    );
  }
}

export default RenderNetwork;
