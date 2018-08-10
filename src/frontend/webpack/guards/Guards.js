import React from 'react';
import {Redirect} from 'react-router-dom';
import EurekaSpinner from '../../webpack/spinners/EurekaSpinner.js';

export const LoginGuard = props => {
  console.log(props);
  if (props.isAuthenticated === null) {
    return <EurekaSpinner />;
  } else {
    if (!props.isAuthenticated) {
      return (
        <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      );
    } else {
      return props.children;
    }
  }
};
