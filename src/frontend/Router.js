import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from './webpack/login/WelcomePage';
import Header from './webpack/Header/Header';
import Login from './webpack/login/Login';
import MetaMaskGuide from './webpack/MetaMaskGuide';
import MainScreen from './dashboard/MainScreen.js';
import {LoginGuard} from './guards/Guards.js';

class Router extends Component {
  constructor() {
    super();
    this.state = {
      authed: false
    };
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <Header
          provider={this.props.provider}
          metaMaskStatus={this.props.metaMaskStatus}
          network={this.props.network}
        />
        <div style={{paddingTop: 100}}>
          <BrowserRouter>
            <Switch>
              <Route path="/metamask" exact render={() => <MetaMaskGuide />} />
              {/*TODO: handle guard for this route*/}
              <Route
                path="/dashboard"
                exact
                render={() => (
                  <LoginGuard authed={this.state.authed}>
                    <MainScreen
                      provider={this.props.provider}
                      web3={this.props.web3}
                      metaMaskStatus={this.props.metaMaskStatus}
                      accounts={this.props.accounts}
                    />
                  </LoginGuard>
                )}
              />
              <Route
                path="/login"
                exact
                render={() => (
                  <Login
                    provider={this.props.provider}
                    web3={this.props.web3}
                    metaMaskStatus={this.props.metaMaskStatus}
                    accounts={this.props.accounts}
                    authed={this.state.authed}
                    setAuth={authed => {
                      this.setState({authed});
                    }}
                  />
                )}
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
