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
import Reviewers from '../Reviewers.js';
import UserExploration from '../UserExploration.js';
import ReviewsRouter from './ReviewsRouter.js';
import PreviewRouter from './PreviewRouter.js';
import ReviewsWriter from '../Reviews/ReviewsWriter.js';

class DashboardRouter extends Component {
  render() {
    return (
      <div>
        <TopContainer
          metaMaskStatus={this.props.metaMaskStatus}
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
              <ContractOwnerGuard>
                <ContractOwnerDashboard
                  selectedAccount={this.props.selectedAccount}
                />
              </ContractOwnerGuard>
            )}
          />

          <Route
            exact
            path={`${this.props.base}/book`}
            render={() => (
              <AddressBook selectedAccount={this.props.selectedAccount} />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/account`}
            render={() => (
              <MyAccount
                selectedAccount={this.props.selectedAccount}
                updateAccount={() => {
                  this.props.updateAccount();
                }}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/actions`}
            render={() => (
              <MyHistory
                base={`${this.props.base}/actions`}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            path={`${this.props.base}/reviews`}
            render={() => {
              return (
                <ReviewsRouter
                  base={`${this.props.base}/reviews`}
                  updateUser={() => {
                    this.props.updateUser();
                  }}
                  selectedAccount={this.props.selectedAccount}
                />
              );
            }}
          />

          <Route
            path={`${this.props.base}/articles`}
            render={() => (
              <ArticlesRouter
                base={`${this.props.base}/articles`}
                updateUser={() => {
                  this.props.updateUser();
                }}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          <Route
            path={`${this.props.base}/editor`}
            render={() => (
              <EditorRouter
                base={`${this.props.base}/editor`}
                selectedAccount={this.props.selectedAccount}
                network={this.props.network}
              />
            )}
          />

          {/*ROUTES IN DASHBOARD WHICH ARE NOT INCLUDED IN PANEL LEFT */}
          <Route
            exact
            path={`${this.props.base}/reviewers`}
            render={() => <Reviewers />}
          />

          <Route
            exact
            path={`${this.props.base}/users/:ethereumAddress`}
            render={() => <UserExploration />}
          />

          <Route
            path={`${this.props.base}/preview/:id`}
            render={() => (
              <PreviewRouter
                base={`${this.props.base}/preview`}
                cardTitle={'Article Preview'}
              />
            )}
          />

          {/*ReviewsWriter route. Intentionally not kept as a subroute of /reviews*/}
          <Route
            path={`${this.props.base}/write/review/:reviewId`}
            render={() => (
              <ReviewsWriter
                base={`${this.props.base}/write/review`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
                network={this.props.network}
              />
            )}
          />

          {/*Redirect to dashboard. Leave it at the bottom!*/}
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
