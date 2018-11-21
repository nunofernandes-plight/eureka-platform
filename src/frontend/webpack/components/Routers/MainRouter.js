import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from '../../views/WelcomePage';
import {Header} from '../Header';
import Login from '../Login';
import MetaMaskGuide from '../../views/MetaMaskGuide';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import SignUp from '../SignUp.js';
import PanelLeft from '../PanelLeft.js';
import {DashBoardGuard, LoginGuard} from '../Guards/Guards.js';
import {MAKE_MOBILE} from '../../../helpers/mobile.js';
import {
  PANEL_LEFT_BREAK_POINT,
  PANEL_LEFT_MOBILE_WIDTH,
  PANEL_LEFT_NORMAL_WIDTH,
  HEADER_PADDING_TOP
} from '../../../helpers/layout.js';
import DashboardRouter from './DashboardRouter.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import {connect} from 'react-redux';
import {fetchUserData} from '../../reducers/user.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';

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
      errorMessage: null,
      isMobileMode: false
    };
  }

  componentDidMount() {
    this.authenticate();
  }
  authenticate() {
    this.props.fetchUserData();
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
        this.props.fetchUserData();
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          isLoading: false
        });
      });
  }

  getPaddingTop() {
    if (this.props.isAuthenticated) {
      return 0;
    }
    return HEADER_PADDING_TOP;
  }

  areEssentialsLoading() {
    return this.props.userDataLoading || this.props.accountsLoading;
  }

  render() {
    return (
      <div>
        {this.areEssentialsLoading() ? (
          <GridSpinner />
        ) : (
          <Fragment>
            <Header provider={this.props.context.provider} />
            <div style={{paddingTop: this.getPaddingTop()}}>
              <BrowserRouter>
                <Switch>
                  <Route
                    path="/metamask"
                    exact
                    render={() => <MetaMaskGuide />}
                  />
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
                            updateUser={() => {
                              this.authenticate();
                            }}
                            selectedAccount={this.props.selectedAccount}
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
                        <LoginGuard>
                          <Login
                            accounts={this.props.accounts}
                            selectedAccount={this.props.selectedAccount}
                            changeAccount={selectedAccount => {
                              this.props.changeAccount(selectedAccount);
                            }}
                            authenticate={() => {
                              this.authenticate();
                            }}
                          />
                        </LoginGuard>
                      </div>
                    )}
                  />
                  {/*
            Startsite always needs to be at the bottom!
            It otherwise matches sub routes
          */}
                  <Route path="/" exact render={() => <WelcomePage />} />
                  <Route
                    render={() => (
                      <div>TODO: IMPLEMENT 404 NOT FOUND PAGE </div>
                    )}
                  />
                </Switch>
              </BrowserRouter>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withWeb3(
  connect(
    state => ({
      isAuthenticated: state.userData.isAuthenticated,
      userDataLoading: state.userData.loading,
      errorMessage: state.userData.error,
      selectedAccount: state.accountsData.selectedAccount,
      accountsLoading: state.accountsData.loading
    }),
    dispatch => {
      return {
        fetchUserData: () => {
          dispatch(fetchUserData());
        }
      };
    }
  )(MainRouter)
);
