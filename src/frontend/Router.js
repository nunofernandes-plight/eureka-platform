import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from './webpack/login/WelcomePage';
import Header from './webpack/Header/Header';
import Login from './webpack/login/Login';
import MetaMaskGuide from './webpack/MetaMaskGuide';
import MainScreen from './webpack/dashboard/MainScreen.js';
import {getDomain} from '../helpers/getDomain.js';
import SignUp from './webpack/login/SignUp.js';

class Router extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      userAddress: null
    };
  }

  componentDidMount() {
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
            userAddress: response.data.user,
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
      });
  }

  componentWillReceiveProps(nextProps) {
    const selectedAddress = nextProps.selectedAccount.address;
    // check if user changed address during the session
    if (this.state.userAddress !== selectedAddress) {
      this.setState({
        isAuthenticated: false
      });
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
        />
        <div style={{paddingTop: 100}}>
          <BrowserRouter>
            <Switch>
              <Route path="/metamask" exact render={() => <MetaMaskGuide />} />
              <Route
                path="/dashboard"
                exact
                render={() => (
                  <MainScreen
                    provider={this.props.provider}
                    web3={this.props.web3}
                    metaMaskStatus={this.props.metaMaskStatus}
                    accounts={this.props.accounts}
                    isAuthenticated={this.state.isAuthenticated}
                    userAddress={this.state.userAddress}
                  />
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
                    setAuth={isAuthenticated => {
                      this.setState({isAuthenticated});
                    }}
                  />
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
                    selectedAccount={this.props.selectedAccount}
                    changeAccount={selectedAccount => {
                      this.props.changeAccount(selectedAccount);
                    }}
                    setAuth={isAuthenticated => {
                      this.setState({isAuthenticated});
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
