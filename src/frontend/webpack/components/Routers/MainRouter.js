import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';
import {BrowserRouter, Redirect} from 'react-router-dom';
import WelcomePage from '../../views/WelcomePage';
import Header from '../Header';
import Login from '../Login';
import MetaMaskGuide from '../../views/MetaMaskGuide';
import {getDomain} from '../../../../helpers/getDomain.mjs';
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
import withWeb3 from '../../contexts/WithWeb3.js';
import {connect} from 'react-redux';
import {fetchUserData} from '../../reducers/user.js';

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
    this.props.fetchUserData();
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

  action(actionType) {
    if (actionType === 'power_settings_new') {
      this.logout();
    }
  }

  logout() {
    this.setState({isLoading: true});
    fetch(`${getDomain()}/api/logout`, {
      method: 'POST',
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
          provider={this.props.context.provider}
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
                    <DashBoardGuard>
                      <PanelLeft
                        base={'/app'}
                        checked={this.state.isMobileMode}
                        isMobileMode={isMobileMode => {
                          this.setState({isMobileMode});
                        }}
                      />
                      <DashboardRouter
                        base={'/app'}
                        user={this.state.user}
                        updateUser={() => {
                          this.authenticate();
                        }}
                        selectedAccount={this.props.selectedAccount}
                        metaMaskStatus={this.props.metaMaskStatus}
                        network={this.props.network}
                        action={item => this.action(item)}
                        updateAccount={() => {
                          this.props.updateAccount();
                        }}
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

export default withWeb3(
  connect(
    state => ({}),
    dispatch => {
      return {
        fetchUserData: () => {
          dispatch(fetchUserData());
        }
      };
    }
  )(MainRouter)
);
