import React, {Component} from 'react';
import {Detector} from 'react-detect-offline';
import {getBalanceOf} from '../smartcontracts/methods/web3-token-contract-methods.mjs';
import MainRouter from './webpack/components/Routers/MainRouter.js';
import Web3Providers from './web3/Web3Providers.js';
import NoConnection from './webpack/views/NoConnection.js';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts, getNetwork} from './web3/Helpers.js';
import withWeb3 from './webpack/contexts/WithWeb3.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      metaMaskStatus: null,
      accounts: null,
      selectedAccount: {
        address: null,
        balance: null,
        EKABalance: null
      }
    };
  }

  async componentDidMount() {
    const network = await getNetwork(this.props.context.web3);
    const metaMaskStatus = await getMetaMaskStatus(this.props.context.web3);
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

    selectedAccount.balance = accounts.get(selectedAccount.address);

    selectedAccount.EKABalance = await getBalanceOf(
      this.props.context.tokenContract,
      selectedAccount.address
    );

    this.setState({selectedAccount});

    this.setState({network, metaMaskStatus, accounts});
    this.interval = setInterval(async () => {
      const metaMaskStatus = await getMetaMaskStatus(this.props.context.web3);
      // Const accounts = await getAllAccounts(this.state.web3);
      this.setState({metaMaskStatus});
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
                  network={this.state.network}
                  metaMaskStatus={this.state.metaMaskStatus}
                  accounts={this.state.accounts}
                  selectedAccount={this.state.selectedAccount}
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

export default withWeb3(App);
