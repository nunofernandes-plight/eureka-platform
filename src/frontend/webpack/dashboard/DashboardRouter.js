import React, {Component} from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import Dashboard from './Dashboard.js';
import MyAccount from './MyAccount.js';

class DashboardRouter extends Component {
  render() {
    return (
      <div>
        <Route
          exact
          path={`${this.props.base}/dashboard`}
          render={() => <Dashboard />}
        />

        <Route
          exact
          path={`${this.props.base}/account`}
          render={() => <MyAccount />}
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
