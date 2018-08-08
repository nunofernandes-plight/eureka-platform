import React from 'react';
import {Redirect} from 'react-router-dom';

export const LoginGuard = props => {
  if (!props.isAuthenticated) {
    return (
      <Redirect to={{pathname: '/login', state: {from: props.location}}} />
    );
  } else {
    return props.children;
  }
};
