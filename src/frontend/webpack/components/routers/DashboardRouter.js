import React, {Component} from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import Dashboard from '../Dashboard.js';
import MyAccount from '../MyAccount.js';
import {TopContainer} from '../../views/TopContainer.js';
import {BottomContainer} from '../../views/BottomContainer.js';
import MyArticles from '../MyArticles.js';
import DocumentEditor from '../DocumentEditor.js';

class DashboardRouter extends Component {
  render() {
    return (
      <div>
        <TopContainer
          user={this.props.user}
          metaMaskStatus={this.props.metaMaskStatus}
          network={this.props.network}
        />
        <BottomContainer>
          <Route
            exact
            path={`${this.props.base}/dashboard`}
            render={() => <Dashboard />}
          />

          <Route
            exact
            path={`${this.props.base}/account`}
            render={() => <MyAccount user={this.props.user} />}
          />

          <Route
            path={`${this.props.base}/articles`}
            render={() => (
              <MyArticles
                base={`${this.props.base}/articles`}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
              />
            )}
          />

          {/*<Route*/}
          {/*exactly*/}
          {/*path={`${this.props.base}/articles/drafts/:id`}*/}
          {/*render={props => (*/}
          {/*<DocumentEditor*/}
          {/*user={this.props.user}*/}
          {/*selectedAccount={this.props.selectedAccount}*/}
          {/*{...props}*/}
          {/*/>*/}
          {/*)}*/}
          {/*/>*/}

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
