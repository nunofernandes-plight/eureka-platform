import React, {Component} from 'react';
import Dashboard from './Dashboard.js'; 
import {Switch, Route} from 'react-router';



class DashboardRouter extends Component {
  render() {
    return (
      <Route
        exact
        path={`${this.props.base}/dashboard`}
        render={() => <Dashboard />}
      />
    );
  }
}

export default DashboardRouter;
