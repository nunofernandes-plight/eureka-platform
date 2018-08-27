import React, {Component} from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import Dashboard from '../Dashboard.js';
import MyAccount from '../MyAccount.js';
import TopContainer from '../../views/TopContainer.js';
import {BottomContainer} from '../../views/BottomContainer.js';
import ArticlesRouter from './ArticlesRouter.js';
import AddressBook from '../AddressBook.js';

class DashboardRouter extends Component {
  constructor() {
    super();
  }

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
            path={`${this.props.base}/articles`}
            render={() => (
              <ArticlesRouter
                web3={this.props.web3}
                tokenContract={this.props.tokenContract}
                platformContract={this.props.platformContract}
                base={`${this.props.base}/articles`}
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
