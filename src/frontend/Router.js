import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from './webpack/login/WelcomePage';
import Header from './webpack/Header';
import Login from './webpack/login/Login';
import MetaMaskGuide from './webpack/MetaMaskGuide';
import Web3 from 'web3';

class Router extends Component {
  constructor() {
    super();
    let web3 = window.web3;
    let web3Instance = null;
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3Instance = new Web3(web3.currentProvider);
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );

      web3Instance = new Web3(this.web3Provider);
    }

    this.state = {
      web3: web3Instance
    };
  }
  render() {
    return (
      <div>
        <Header />
        <div style={{paddingTop: 100}}>
          <BrowserRouter>
            <Switch>
              <Route path="/metamask" exact render={() => <MetaMaskGuide />} />
              <Route
                path="/login"
                exact
                render={() => <Login web3={this.state.web3} />}
              />
              <Route path="/" exact render={() => <WelcomePage />} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default Router;
