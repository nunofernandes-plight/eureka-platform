import React, {Component} from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import Dashboard from '../Dashboard.js';
import MyAccount from '../MyAccount.js';
import MyHistory from '../MyHistory/MyHistory.js';
import TopContainer from '../../views/TopContainer.js';
import {BottomContainer} from '../../views/BottomContainer.js';
import ArticlesRouter from './ArticlesRouter.js';
import AddressBook from '../AddressBook/AddressBook.js';
import ContractOwnerDashboard from '../ContractOwnerDashboard.js';
import {ContractOwnerGuard} from '../Guards/Guards.js';
import EditorRouter from './EditorRouter.js';
import MyReviews from '../Reviews/MyReviews.js';

class DashboardRouter extends Component {
  render() {
    return (
      <div>
        <TopContainer
          user={this.props.user}
          metaMaskStatus={this.props.metaMaskStatus}
          network={this.props.network}
          action={item => this.props.action(item)}
          selectedAccount={this.props.selectedAccount}
        />
        <BottomContainer>
          <Route
            exact
            path={`${this.props.base}/dashboard`}
            render={() => <Dashboard />}
          />

          <Route
            exact
            path={`${this.props.base}/owner`}
            render={() => (
              <ContractOwnerGuard roles={this.props.user.roles}>
                <ContractOwnerDashboard
                  tokenContract={this.props.tokenContract}
                  platformContract={this.props.platformContract}
                  web3={this.props.web3}
                  selectedAccount={this.props.selectedAccount}
                />
              </ContractOwnerGuard>
            )}
          />

          <Route
            exact
            path={`${this.props.base}/book`}
            render={() => (
              <AddressBook
                web3={this.props.web3}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/account`}
            render={() => (
              <MyAccount
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/actions`}
            render={() => (
              <MyHistory
                base={`${this.props.base}/actions`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/reviews`}
            render={() => (
              <MyReviews
                base={`${this.props.base}/reviews`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            path={`${this.props.base}/articles`}
            render={() => (
              <ArticlesRouter
                web3={this.props.web3}
                tokenContract={this.props.tokenContract}
                platformContract={this.props.platformContract}
                base={`${this.props.base}/articles`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
                network={this.props.network}
              />
            )}
          />

          <Route
            path={`${this.props.base}/editor`}
            render={() => (
              <EditorRouter
                web3={this.props.web3}
                tokenContract={this.props.tokenContract}
                platformContract={this.props.platformContract}
                base={`${this.props.base}/editor`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/dashboard`} />}
          />
        </BottomContainer>
      </div>
    );
  }
}

export default DashboardRouter;
