import React from 'react';
import {Redirect} from 'react-router-dom';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';

export const DashBoardGuard = props => {
  if (props.isAuthenticated === null) {
    return <GridSpinner />;
  }
  if (!props.isAuthenticated) {
    return (
      <Redirect to={{pathname: '/login', state: {from: props.location}}} />
    );
  }
  return props.children;
};

export const ContractOwnerGuard = props => {
  if (props.roles.includes(Roles.CONTRACT_OWNER)) {
    return props.children;
  } else {
    return <Redirect to={{pathname: '/app', state: {from: props.location}}} />;
  }
};
