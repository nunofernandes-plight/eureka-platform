import React from 'react';
import App from './App.js';
import {Provider as ReduxProvider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import reducer from './webpack/reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
    // other store enhancers if any
  )
);

class ReduxInit extends React.Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    );
  }
}

export default ReduxInit;
