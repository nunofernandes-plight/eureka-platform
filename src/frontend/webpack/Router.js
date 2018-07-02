import React, {Component} from 'react';
import {Switch, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import WelcomePage from './WelcomePage';
import Header from './Header';

class Router extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route path="/" exact render={() => <WelcomePage />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Router;
