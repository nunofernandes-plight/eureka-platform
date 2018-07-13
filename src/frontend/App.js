import React, {Component} from 'react';
import Router from './Router';
import Web3Providers from './web3/Web3Providers.js';
import Web3 from 'web3';

class App extends Component {
  constructor() {
    super();
    let web3 = window.web3;
    let provider;
    if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
      // MetaMask as main provider
      console.info('MetaMask detected in this browser');
      web3 = new Web3(web3.currentProvider);
      provider = Web3Providers.META_MASK;
    } else {
      // TODO: fallback strategy
    }
    this.state = {
      web3,
      provider
    };
  }

  render() {
    return (
      <div>
        <Router web3={this.state.web3} provider={this.state.provider} />
      </div>
    );
  }
}

export default App;
