import React, {Component} from 'react';
import Router from './Router';
import Web3Providers from './web3/Web3Providers.js';
import Web3 from 'web3';
import Network from './web3/Network.js';
import NoConnection from './webpack/NoConnection.js';
import {Detector} from 'react-detect-offline';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts, getNetwork} from './web3/Helpers.js';
import abi from './web3/eureka-ABI.json';

class App extends Component {
  constructor() {
    super();
    const EUREKA_PROD_ADDRESS = '';
    let web3 = window.web3;
    let web3Instance = null;
    let contract = null;
    let provider;
    if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
      // MetaMask as main provider
      console.info('MetaMask detected in this browser');
      web3Instance = new Web3(web3.currentProvider);
      provider = Web3Providers.META_MASK;
      contract = new web3Instance.eth.Contract(abi);
    } else {
      web3Instance = new Web3('http://localhost:7545');
      contract = new web3Instance.eth.Contract(abi, EUREKA_PROD_ADDRESS);
      provider = Web3Providers.LOCALHOST;
    }

    this.state = {
      web3: web3Instance,
      provider,
      metaMaskStatus: null,
      accounts: null,
      contract,
      selectedAccount: {
        address: null,
        balance: null
      }
    };
  }

  async componentDidMount() {
    const network = await getNetwork(this.state.web3);
    const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
    const accounts = await getAllAccounts(this.state.web3);
    this.setState({network, metaMaskStatus, accounts});
    this.interval = setInterval(async () => {
      const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
      // const accounts = await getAllAccounts(this.state.web3);
      this.setState({metaMaskStatus});
    }, 5000);
  }

  // Ganache switch addresses
  async changeAccount(selectedAccount) {
    let account = {...this.state.selectedAccount};
    account.address = selectedAccount.address;

    const accounts = await getAllAccounts(this.state.web3);
    if (accounts.get(account.address)) {
      account.balance = accounts.get(account.address);
    }

    this.setState({selectedAccount: account});
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Detector
          render={({online}) =>
            online ? (
              <Router
                web3={this.state.web3}
                provider={this.state.provider}
                network={this.state.network}
                metaMaskStatus={this.state.metaMaskStatus}
                accounts={this.state.accounts}
                selectedAccount={this.state.selectedAccount}
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

export default App;
