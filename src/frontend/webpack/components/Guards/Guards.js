import React from 'react';
import {Redirect} from 'react-router-dom';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';
import {connect} from 'react-redux';
import {fetchUserData} from '../../reducers/user.js';

const mapDispatchToProps = dispatch => ({
  fetchUserData: () => {
    dispatch(fetchUserData());
  }
});
const mapStateToProps = state => ({
  isAuthenticated: state.userData.isAuthenticated
});

export const DashBoardGuard = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => {
  if (props.isAuthenticated === null) {
    return <GridSpinner />;
  }
  if (!props.isAuthenticated) {
    return (
      <Redirect to={{pathname: '/login', state: {from: props.location}}} />
    );
  }
  return props.children;
});

export const ContractOwnerGuard = props => {
  if (props.roles.includes(Roles.CONTRACT_OWNER)) {
    return props.children;
  } else {
    return <Redirect to={{pathname: '/app', state: {from: props.location}}} />;
  }
};
