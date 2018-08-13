import React from 'react';
import {Redirect} from 'react-router-dom';
import GridSpinner from '../../webpack/spinners/GridSpinner.js';

export const DashBoardGuard = props => {
  if (props.isAuthenticated === null) {
    return <GridSpinner />;
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
