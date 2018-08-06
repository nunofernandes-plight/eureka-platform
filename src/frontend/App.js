import React, {Component} from 'react';
import Router from './Router';
import Web3Providers from './web3/Web3Providers.js';
import Web3 from 'web3';
import Network from './web3/Network.js';
import NoConnection from './webpack/NoConnection.js';
import {Detector} from 'react-detect-offline';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts} from './web3/Helpers.js';
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
    } else if (typeof web3 !== 'undefined') {
      console.info('Ganache detected in this browser');
    } else {
      web3Instance = new Web3('http://localhost:7545');
      contract = new web3Instance.eth.Contract(abi, EUREKA_PROD_ADDRESS);
      provider = Web3Providers.LOCALHOST;
      // TODO: fallback strategy
    }

    this.state = {
      web3: web3Instance,
      provider,
      network: null,
      metaMaskStatus: null,
      accounts: null,
      contract
    };

    this.getNetwork();
    this.callMetaMaskStatus();
    this.getAccounts();

    console.log(contract);
  }

  async callMetaMaskStatus() {
    const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
    this.setState({metaMaskStatus});
    this.interval = setInterval(async () => {
      const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
      this.setState({metaMaskStatus});
    }, 1500);
  }

  async getAccounts() {
    const accounts = await getAllAccounts(this.state.web3);
    this.setState({accounts});
    this.interval = setInterval(async () => {
      const accounts = await getAllAccounts(this.state.web3);
      this.setState({accounts});
    }, 2000);
  }

  async getNetwork() {
    if (this.state.web3) {
      const netId = await this.state.web3.eth.net.getId().then(netId => {
        return netId;
      });

      console.log(netId);
      switch (netId.toString()) {
        case '1':
          console.log('Mainnet detected');
          this.setState({network: Network.MAIN});
          break;
        case '2':
          console.log('Morden test network detected.');
          this.setState({network: Network.MORDEN});
          break;
        case '3':
          console.log('Ropsten test network detected.');
          this.setState({network: Network.ROPSTEN});
          break;
        case '4':
          console.log('Rinkeby test network detected.');
          this.setState({network: Network.RINKEBY});
          break;
        case '42':
          console.log('Kovan test network detected.');
          this.setState({network: Network.KOVAN});
          break;
        case '5777':
          console.log('GANACHE test network detected.');
          this.setState({network: Network.GANACHE});
          break;
        default:
          this.setState({network: Network.UNKNOWN});
          console.log('Unknown network detected.');
      }
    }
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
