import React, {Component} from 'react';
import Router from './Router';
import Web3Providers from './web3/Web3Providers.js';
import Web3 from 'web3';
import Network from './web3/Network.js';
import NoConnection from './webpack/NoConnection.js';
import {Detector} from 'react-detect-offline';


class App extends Component {
  constructor() {
    super();
    let web3 = window.web3;
    let web3Instance = null;
    let provider;
    if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
      // MetaMask as main provider
      console.info('MetaMask detected in this browser');
      web3Instance = new Web3(web3.currentProvider);
      provider = Web3Providers.META_MASK;
    } else {
      // TODO: fallback strategy
    }
    this.state = {
      web3: web3Instance,
      provider,
      network: null
    };

    this.getNetwork();
  }

  async getNetwork() {
    window.web3.version.getNetwork((err, netId) => {
      switch (netId) {
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
        default:
          this.setState({network: Network.UNKNOWN});
          console.log('Unknown network detected.');
      }
    });
  }

  render() {
    return (
      <div>
        <Detector
          render={({online}) =>
            online ? (
              window.web3.isConnected() ? (
                <Router
                  web3={this.state.web3}
                  provider={this.state.provider}
                  network={this.state.network}
                />
              ) : (
                <h1>
                  We were not able to connect web3. Application cannot be
                  started
                </h1>
              )
            ) : (
              <NoConnection/>
            )
          }
        />
      </div>
    );
  }
}

export default App;
