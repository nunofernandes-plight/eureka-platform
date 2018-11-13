import React, {Component} from 'react';
import Web3 from 'web3';
import {applyMiddleware, createStore} from 'redux';
import {Provider as ReduxProvider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './webpack/reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Detector} from 'react-detect-offline';
import {getBalanceOf} from '../smartcontracts/methods/web3-token-contract-methods.mjs';
import MainRouter from './webpack/components/Routers/MainRouter.js';
import Web3Providers from './web3/Web3Providers.js';
import NoConnection from './webpack/views/NoConnection.js';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts, getNetwork} from './web3/Helpers.js';
import platformABI from '../smartcontracts/constants/GanachePlatformContractABI.json';
import tokenABI from '../smartcontracts/constants/GanacheTokenContractABI.json';
import platformAddress from '../smartcontracts/constants/GanachePlatformContractAddress.json';
import tokenAddress from '../smartcontracts/constants/GanacheTokenContractAddress.json';
import {
  PLATFORM_KOVAN_ADDRESS,
  TOKEN_KOVAN_ADDRESS
} from '../smartcontracts/constants/KovanContractAddresses.mjs';
import withWeb3 from './webpack/contexts/WithWeb3.js';

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
    // other store enhancers if any
  )
);

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
            online || this.props.context.provider === Web3Providers.LOCALHOST ? (
              <ReduxProvider store={store}>
                <MainRouter
                  platformContract={this.props.context.platformContract}
                  tokenContract={this.props.context.tokenContract}
                  web3={this.props.context.web3}
                  provider={this.props.context.provider}
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
              </ReduxProvider>
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
