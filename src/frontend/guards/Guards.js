import React from 'react';
import {Redirect} from 'react-router-dom';

export const LoginGuard = props => {
  if (!props.authed) {
    return <Redirect to="/login" />;
  } else {
    return props.children;
  }
};
