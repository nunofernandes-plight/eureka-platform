import React, {Component} from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import Dashboard from './Dashboard.js';
import MyAccount from './MyAccount.js';
import {TopContainer} from "./TopContainer.js";
import MyArticles from './MyArticles.js';
import DocumentEditor from './DocumentEditor.js';

class DashboardRouter extends Component {
  render() {
    return (
      <div>
        <TopContainer user={this.props.user} />
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
          exact
          path={`${this.props.base}/articles`}
          render={() => (
            <MyArticles
              base={`${this.props.base}/articles`}
              user={this.props.user}
              selectedAccount={this.props.selectedAccount}
            />
          )}
        />

        <Route
          exactly
          path={`${this.props.base}/articles/:id`}
          render={props => (
            <DocumentEditor
              user={this.props.user}
              selectedAccount={this.props.selectedAccount}
              {...props}
            />
          )}
        />

        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/dashboard`} />}
        />
      </div>
    );
  }
}

export default DashboardRouter;
