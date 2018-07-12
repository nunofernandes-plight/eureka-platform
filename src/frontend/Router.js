import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from './webpack/login/WelcomePage';
import Header from './webpack/Header';
import Login from './webpack/login/Login';

class Router extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header />
        <div style={{paddingTop: 100}}>
          <BrowserRouter>
            <Switch>
              <Route path="/login" exact render={() => <Login />} />
              <Route path="/" exact render={() => <WelcomePage />} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default Router;
