import React, {Component} from 'react';
import styled from 'styled-components';
import {__MAIN, __SECOND, __THIRD} from '../helpers/colors.js';
import Network from '../web3/Network.js';
import Icon from '../webpack/icons/Icon.js';

const NetworkContainer = styled.div`
  font-size: 13px;
  padding: 6px 10px;
  background: ${props => getColor(props.network)};
  border-radius: 6px;
  color: white;
`;

const getColor = network => {
  switch (network) {
    case Network.ROPSTEN:
      return `${__THIRD}`;

    case Network.MAIN:
      return `${__SECOND}`;

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
        <Icon icon={'internet'} width={15} height={15} color={'white'} />
      </NetworkContainer>
    );
  }
}

export default RenderNetwork;
