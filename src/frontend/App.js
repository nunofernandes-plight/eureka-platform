import React, {Component} from 'react';
import {Detector} from 'react-detect-offline';
import MainRouter from './webpack/components/Routers/MainRouter.js';
import Web3Providers from './web3/Web3Providers.js';
import NoConnection from './webpack/views/NoConnection.js';
import withWeb3 from './webpack/contexts/WithWeb3.js';
import {connect} from 'react-redux';
import {updateNetwork} from './webpack/reducers/network.js';
import {updateMetaMask} from './webpack/reducers/metamask.js';
import {updateAccounts} from './webpack/reducers/account.js';

class App extends Component {
  componentDidMount() {
    const web3 = this.props.context.web3;
    const provider = this.props.context.provider;
    const tokenContract = this.props.context.tokenContract;
    this.props.updateNetwork(web3);
    this.props.updateMetaMask(web3);
    this.props.updateAccounts(web3, provider, tokenContract);
    this.interval = setInterval(async () => {
      this.props.updateMetaMask(web3);
    }, 7500);
  }

  // Ganache switch addresses
  async changeAccount(selectedAccount) {
    localStorage.setItem(
      'ganache',
      JSON.stringify(selectedAccount.address.toString())
    );
    this.props.updateAccounts(
      this.props.context.web3,
      this.props.context.provider,
      this.props.context.tokenContract
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Detector
          render={({online}) =>
            online ||
            this.props.context.provider === Web3Providers.LOCALHOST ? (
              <MainRouter
                accounts={this.props.accounts}
                selectedAccount={this.props.selectedAccount}
                changeAccount={account => {
                  this.changeAccount(account);
                }}
              />
            ) : (
              <NoConnection />
            )
          }
        />
      </div>
    );
  }
}

export default withWeb3(
  connect(
    state => ({
      network: state.networkData.network,
      metaMaskStatus: state.metamaskData.status,
      accounts: state.accountsData.accounts,
      selectedAccount: state.accountsData.selectedAccount
    }),
    dispatch => {
      return {
        updateNetwork: web3 => {
          dispatch(updateNetwork(web3));
        },
        updateMetaMask: web3 => {
          dispatch(updateMetaMask(web3));
        },
        updateAccounts: (web3, provider, tokenContract) => {
          dispatch(updateAccounts(web3, provider, tokenContract));
        }
      };
    }
  )(App)
);
