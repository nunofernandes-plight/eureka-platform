import React from 'react';
import {
  TitleRow,
  Title,
  AlertDevContainer,
  AlertContainer
} from './SharedForms.js';
import Web3Providers from '../../web3/Web3Providers.js';
import EurekaLogo from '../../webpack/icons/EurekaLogo.js';
import Alert from '../design-components/Alerts.js';

class TopAlertContainer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <TitleRow>
        {this.props.provider === Web3Providers.META_MASK ? (
          <AlertContainer>
            <Alert status={'info'}>
              We detected MetaMask in your Browser! We use it as our
              authentication provider. Please note that we are not able neither
              to see nor to store your private keys.{' '}
            </Alert>
          </AlertContainer>
        ) : null}
        {this.props.provider === Web3Providers.LOCALHOST ? (
          <AlertDevContainer>
            <Alert status={'warning'}>THIS IS A DEV ENVIRONMENT</Alert>
          </AlertDevContainer>
        ) : null}
        <Title>
          Welcome to{' '}
          <div style={{marginLeft: 10}}>
            <EurekaLogo blueNoLogo width={200} />
          </div>
        </Title>
      </TitleRow>
    );
  }
}

export default TopAlertContainer;
