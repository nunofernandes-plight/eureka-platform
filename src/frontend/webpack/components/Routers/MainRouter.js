import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';
import {BrowserRouter, Redirect} from 'react-router-dom';
import WelcomePage from '../../views/WelcomePage';
import Header from '../Header';
import Login from '../Login';
import MetaMaskGuide from '../../views/MetaMaskGuide';
import {getDomain} from '../../../../helpers/getDomain.js';
import SignUp from '../SignUp.js';
import PanelLeft from '../PanelLeft.js';
import {DashBoardGuard} from '../Guards/Guards.js';
import {MAKE_MOBILE} from '../../../helpers/mobile.js';
import {
  PANEL_LEFT_BREAK_POINT,
  PANEL_LEFT_MOBILE_WIDTH,
  PANEL_LEFT_NORMAL_WIDTH,
  HEADER_PADDING_TOP
} from '../../../helpers/layout.js';
import Modal from '../../design-components/Modal.js';
import DashboardRouter from './DashboardRouter.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';

const PaddingLeft = styled.div`
  padding-left: ${props =>
    props.isMobileMode ? PANEL_LEFT_MOBILE_WIDTH : PANEL_LEFT_NORMAL_WIDTH}px;
  ${MAKE_MOBILE(PANEL_LEFT_BREAK_POINT)`
    padding-left: ${PANEL_LEFT_MOBILE_WIDTH}px; 
  `};
  transition: 0.5s all;
`;

class MainRouter extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: null,
      user: null,
      isLoading: false,
      errorMessage: null,
      isMobileMode: false
    };
  }

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    fetch(`${getDomain()}/api/users/data`, {
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
          let user = response.data.user;
          user.roles.push(Roles.USER);
          this.setState({
            user,
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

  action(item) {
    this.setState({isLoading: true});
    fetch(`${getDomain()}/api/${item.action}`, {
      method: item.method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({isAuthenticated: response.data.isAuthenticated});
        } else {
          this.setState({errorMessage: response.error});
        }
        this.setState({isLoading: false});
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          isLoading: false
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const selectedAddress = nextProps.selectedAccount.address;
    if (this.state.user) {
      const loadedAddress = this.state.user.ethereumAddress;
      // Check if user changed address during the session
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
    }
    return HEADER_PADDING_TOP;
  }

  renderModals() {
    return (
      <Modal
        type={'notification'}
        toggle={isErrorMessage => {
          this.setState({errorMessage: null});
        }}
        show={this.state.errorMessage}
        title={'You got the following error'}
      >
        {this.state.errorMessage}
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.renderModals()}
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
                  <PaddingLeft isMobileMode={this.state.isMobileMode}>
                    <DashBoardGuard
                      isAuthenticated={this.state.isAuthenticated}
                    >
                      <PanelLeft
                        base={'/app'}
                        checked={this.state.isMobileMode}
                        user={this.state.user}
                        isMobileMode={isMobileMode => {
                          this.setState({isMobileMode});
                        }}
                      />
                      <DashboardRouter
                        web3={this.props.web3}
                        tokenContract={this.props.tokenContract}
                        platformContract={this.props.platformContract}
                        base={'/app'}
                        user={this.state.user}
                        selectedAccount={this.props.selectedAccount}
                        metaMaskStatus={this.props.metaMaskStatus}
                        network={this.props.network}
                        action={item => this.action(item)}
                      />
                    </DashBoardGuard>
                  </PaddingLeft>
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

export default MainRouter;
