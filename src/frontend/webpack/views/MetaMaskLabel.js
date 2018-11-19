import React from 'react';
import styled from 'styled-components';
import {MetaMaskStatus} from '../../web3/MetaMaskStatus.js';
import {
  __ALERT_ERROR,
  __ALERT_SUCCESS,
  __ALERT_WARNING
} from '../../helpers/colors.js';
import MetaMaskLogo from './icons/MetaMaskLogo.js';
import CircleHeaderSpinner from './spinners/CircleHeaderSpinner.js';
import connect from 'react-redux/es/connect/connect.js';

const Item = styled.div`
  margin: 0 10px;
  align-self: center;
`;

const MetaMask = Item.extend`
  display: flex;
  align-items: center;
  font-size: 13px;

  padding-top: 9px;
  padding-bottom: 9px;
  padding-left: 10px;
  padding-right: 4px;
  border-radius: 6px;
`;

const NoMetaMask = MetaMask.extend`
  background: ${__ALERT_ERROR};
  color: white;
`;

const MetaMaskDetectedNoLoggedIn = MetaMask.extend`
  background: ${__ALERT_WARNING};
  color: white;
`;

const MetaMaskDetectedLoggedIn = MetaMask.extend`
  background: ${__ALERT_SUCCESS};
  color: white;
`;

const MetaMaskLabel = ({metaMaskStatus}) => {
  if (!metaMaskStatus) {
    return <CircleHeaderSpinner />;
  }
  const status = metaMaskStatus;
  if (status === MetaMaskStatus.DETECTED_NO_LOGGED_IN) {
    return (
      <MetaMaskDetectedNoLoggedIn>
        MetaMask detected but locked
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </MetaMaskDetectedNoLoggedIn>
    );
  }
  if (status === MetaMaskStatus.NO_DETECTED) {
    return (
      <NoMetaMask>
        No MetaMask detected{' '}
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </NoMetaMask>
    );
  }
  if (status === MetaMaskStatus.DETECTED_LOGGED_IN) {
    return (
      <MetaMaskDetectedLoggedIn>
        MetaMask unlocked
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </MetaMaskDetectedLoggedIn>
    );
  }
  return null;
};

export default connect(state => ({
  metaMaskStatus: state.metamaskData.status
}))(MetaMaskLabel);
