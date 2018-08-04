import React from 'react';
import {Redirect} from 'react-router-dom';

const LoginGuard = props => {
  if (!props.authenticated) {
    return <Redirect to="/login" />;
  } else {
    return props.children;
  }
};

export default LoginGuard;
