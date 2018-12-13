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
import {LARGE_DEVICES} from '../../helpers/mobile.js';

const Item = styled.div`
  margin: 0 10px;
  align-self: center;
`;

const MetaMask = styled(Item)`
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 9px 4px 9px 10px;
  border-radius: 6px;
`;

const NoMetaMask = styled(MetaMask)`
  background: ${__ALERT_ERROR};
  color: white;
`;

const MetaMaskDetectedNoLoggedIn = styled(MetaMask)`
  background: ${__ALERT_WARNING};
  color: white;
`;

const MetaMaskDetectedLoggedIn = styled(MetaMask)`
  background: ${__ALERT_SUCCESS};
  color: white;
`;

const Text = styled.span`
  ${LARGE_DEVICES`
    display: none; 
    `};
`;

const MetaMaskLabel = ({metaMaskStatus}) => {
  if (!metaMaskStatus) {
    return <CircleHeaderSpinner />;
  }
  const status = metaMaskStatus;
  if (status === MetaMaskStatus.DETECTED_NO_LOGGED_IN) {
    return (
      <MetaMaskDetectedNoLoggedIn>
        <Text>MetaMask locked</Text>
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </MetaMaskDetectedNoLoggedIn>
    );
  }
  if (status === MetaMaskStatus.NO_DETECTED) {
    return (
      <NoMetaMask>
        <Text>No MetaMask</Text>
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </NoMetaMask>
    );
  }
  if (status === MetaMaskStatus.DETECTED_LOGGED_IN) {
    return (
      <MetaMaskDetectedLoggedIn>
        <Text>MetaMask unlocked</Text>
        <MetaMaskLogo style={{marginRight: 5}} width={15} height={15} />
      </MetaMaskDetectedLoggedIn>
    );
  }
  return null;
};

export default connect(state => ({
  metaMaskStatus: state.metamaskData.status
}))(MetaMaskLabel);
