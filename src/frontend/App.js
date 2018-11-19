import React, {Component} from 'react';
import {Detector} from 'react-detect-offline';
import {getBalanceOf} from '../smartcontracts/methods/web3-token-contract-methods.mjs';
import MainRouter from './webpack/components/Routers/MainRouter.js';
import Web3Providers from './web3/Web3Providers.js';
import NoConnection from './webpack/views/NoConnection.js';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts} from './web3/Helpers.js';
import withWeb3 from './webpack/contexts/WithWeb3.js';
import {connect} from 'react-redux';
import {updateNetwork} from './webpack/reducers/network.js';
import {updateMetaMask} from './webpack/reducers/metamask.js';
import {updateAccounts} from './webpack/reducers/account.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      accounts: null,
      selectedAccount: {
        address: null,
        balance: null,
        EKABalance: null
      }
    };
  }

  async componentDidMount() {
    const web3 = this.props.context.web3;
    const provider = this.props.context.provider;
    const tokenContract = this.props.context.tokenContract;
    this.props.updateNetwork(web3);
    this.props.updateMetaMask(web3);
    this.props.updateAccounts(web3, provider, tokenContract);

    const accounts = await getAllAccounts(this.props.context.web3);

    const selectedAccount = {...this.state.selectedAccount};
    // Default account for MetaMask
    if (this.props.context.provider === Web3Providers.META_MASK) {
      selectedAccount.address = [...accounts.keys()][0];

      // GANACHE case
    } else if (this.props.context.provider === Web3Providers.LOCALHOST) {
      selectedAccount.address = localStorage.getItem('ganache')
        ? JSON.parse(localStorage.getItem('ganache'))
        : [...accounts.keys()][0];
    }

    if (selectedAccount.address) {
      selectedAccount.balance = accounts.get(selectedAccount.address);
      if (this.props.context.tokenContract)
        selectedAccount.EKABalance = await getBalanceOf(
          this.props.context.tokenContract,
          selectedAccount.address
        );
    }

    this.setState({selectedAccount, accounts});
    this.interval = setInterval(async () => {
      this.props.updateMetaMask(this.props.context.web3);
    }, 7500);
  }

  // Ganache switch addresses
  async changeAccount(selectedAccount) {
    const account = {...this.state.selectedAccount};
    account.address = selectedAccount.address;

    const accounts = await getAllAccounts(this.props.context.web3);
    if (accounts.get(account.address)) {
      account.balance = accounts.get(account.address);
    }

    this.setState({selectedAccount: account});
    localStorage.setItem('ganache', JSON.stringify(account.address.toString()));
    this.props.updateAccounts(
      this.props.context.web3,
      this.props.context.provider,
      this.props.context.tokenContract
    );
  }

  async updateAccount() {
    const accounts = await getAllAccounts(this.props.context.web3);
    const selectedAccount = {...this.state.selectedAccount};

    selectedAccount.balance = accounts.get(selectedAccount.address);

    selectedAccount.EKABalance = await getBalanceOf(
      this.props.context.tokenContract,
      selectedAccount.address
    );

    this.setState({selectedAccount});
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
                updateAccount={() => {
                  this.updateAccount();
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
