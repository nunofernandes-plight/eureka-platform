import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter, Redirect} from 'react-router-dom';
import WelcomePage from './webpack/login/WelcomePage';
import Header from './webpack/Header/Header';
import Login from './webpack/login/Login';
import MetaMaskGuide from './webpack/MetaMaskGuide';
import {getDomain} from '../helpers/getDomain.js';
import SignUp from './webpack/login/SignUp.js';
import PanelLeft from './webpack/dashboard/PanelLeft.js';
import {DashBoardGuard} from './webpack/guards/Guards.js';
import DashboardRouter from './webpack/dashboard/DashboardRouter.js';

class Router extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: null,
      user: null
    };
  }

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    fetch(`${getDomain()}/api/welcome`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        console.log('fetching works');
        if (response.success) {
          this.setState({
            user: response.data.user,
            isAuthenticated: response.data.isAuthenticated
          });
        } else {
          this.setState({
            isAuthenticated: false
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({
          isAuthenticated: false
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const selectedAddress = nextProps.selectedAccount.address;
    if (this.state.user) {
      const loadedAddress = this.state.user.ethereumAddress;
      // check if user changed address during the session
      if (loadedAddress !== selectedAddress) {
        this.setState({
          isAuthenticated: false
        });
      }
    }
  }

  getPaddingTop() {
    if (this.state.isAuthenticated) {
      return 0;
    } else {
      return 100;
    }
  }

  render() {
    return (
      <div>
        <Header
          provider={this.props.provider}
          metaMaskStatus={this.props.metaMaskStatus}
          network={this.props.network}
          isAuthenticated={this.state.isAuthenticated}
          user={this.state.user}
        />
        <div style={{paddingTop: this.getPaddingTop()}}>
          <BrowserRouter>
            <Switch>
              <Route path="/metamask" exact render={() => <MetaMaskGuide />} />
              <Route
                path="/app"
                render={() => (
                  <div>
                    <DashBoardGuard
                      isAuthenticated={this.state.isAuthenticated}
                    >
                      <PanelLeft base={'/app'} />
                      <div style={{paddingLeft: 180}}>
                        <DashboardRouter
                          base={'/app'}
                          user={this.state.user}
                          selectedAccount={this.props.selectedAccount}
                          metaMaskStatus={this.props.metaMaskStatus}
                          network={this.props.network}
                        />
                      </div>
                    </DashBoardGuard>
                  </div>
                )}
              />

              <Route
                path="/signup"
                exact
                render={() => (
                  <SignUp
                    provider={this.props.provider}
                    web3={this.props.web3}
                    metaMaskStatus={this.props.metaMaskStatus}
                    accounts={this.props.accounts}
                    selectedAccount={this.props.selectedAccount}
                    changeAccount={selectedAccount => {
                      this.props.changeAccount(selectedAccount);
                    }}
                    authenticate={() => {
                      this.authenticate();
                    }}
                  />
                )}
              />
              <Route
                path="/login"
                exact
                render={() => (
                  <div>
                    {!this.state.isAuthenticated ? (
                      <Login
                        provider={this.props.provider}
                        web3={this.props.web3}
                        metaMaskStatus={this.props.metaMaskStatus}
                        accounts={this.props.accounts}
                        selectedAccount={this.props.selectedAccount}
                        changeAccount={selectedAccount => {
                          this.props.changeAccount(selectedAccount);
                        }}
                        authenticate={() => {
                          this.authenticate();
                        }}
                      />
                    ) : (
                      <Redirect to={'/app'} />
                    )}
                  </div>
                )}
              />
              {/*
            Startsite always needs to be at the bottom!
            It otherwise matches sub routes
          */}
              <Route path="/" exact render={() => <WelcomePage />} />
              <Route
                render={() => <div>TODO: IMPLEMENT 404 NOT FOUND PAGE </div>}
              />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default Router;
